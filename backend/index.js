const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client initialized:', !!supabase);

// Log de démarrage pour confirmer la connexion à Supabase
(async () => {
  try {
    // Vérifier si on peut se connecter à Supabase
    const { data, error } = await supabase.from('restaurants').select('count');
    if (error) {
      console.error('❌ Erreur de connexion à Supabase:', error.message);
    } else {
      console.log('✅ Connexion à Supabase établie avec succès');
      // Lister les tables disponibles
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (!tablesError) {
        console.log(
          'Tables disponibles:',
          tables.map((t) => t.table_name).join(', ')
        );
      }
    }
  } catch (err) {
    console.error('❌ Erreur lors du test de connexion Supabase:', err.message);
  }
})();

// In-memory storage for restaurants (we'll keep this simple)
const restaurants = new Map();
let contractRegistered = false;

// Mock function that simulates only ZKP validation
const verifyZkProof = async (signedMessage, restaurantPublicKey) => {
  console.log(`[MOCK] Verifying ZK proof for visit`);

  // Add a small delay to simulate processing
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // Parse the signed message
    const message = JSON.parse(signedMessage);
    console.log('Message signé à vérifier:', message);

    // Simulate verification logic
    // In a real implementation, we would verify the signature using the restaurant's public key
    // and ensure the timestamp is within a valid range

    // For the demo, we'll consider it valid if:
    // 1. It has a visit_id
    // 2. It has a timestamp
    // 3. It has a signature
    if (!message.visit_id || !message.timestamp || !message.signature) {
      return {
        valid: false,
        reason: 'Invalid message format',
      };
    }

    // Verify the timestamp is not too old (within 30 days)
    const currentTime = Math.floor(Date.now() / 1000);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    if (currentTime - message.timestamp > thirtyDaysInSeconds) {
      return {
        valid: false,
        reason: 'Visit is too old (more than 30 days)',
      };
    }

    // Valid!
    return {
      valid: true,
      verificationId: crypto.randomBytes(16).toString('hex'),
    };
  } catch (error) {
    console.error('Error verifying ZK proof:', error);
    return {
      valid: false,
      reason: 'Invalid message format',
    };
  }
};

// Register restaurant endpoint
app.post('/register-restaurant', async (req, res) => {
  try {
    const { id, publicKey } = req.body;

    if (!id || !publicKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, publicKey',
      });
    }

    console.log(`Tentative d'enregistrement du restaurant:`, { id, publicKey });

    // Adapter aux colonnes réelles de votre table Supabase
    // Supposons que la table s'appelle "restaurants" avec les colonnes:
    // "id", "name", "public_key" ou "publicKey", "created_at"
    const restaurantData = {
      id: id,
      name: `Restaurant ${id}`,
      // Nous utilisons les deux possibilités pour la clé publique
      public_key: publicKey,
      publicKey: publicKey,
      created_at: new Date().toISOString(),
    };

    // Store restaurant in Supabase
    const { data, error } = await supabase
      .from('restaurants')
      .upsert([restaurantData]);

    if (error) {
      console.error(
        "Erreur lors de l'enregistrement du restaurant dans Supabase:",
        error
      );
      throw error;
    }

    console.log('Restaurant enregistré avec succès dans Supabase');

    // Also keep in memory for quick reference
    restaurants.set(id, { publicKey });

    res.json({
      success: true,
      message: 'Restaurant registered successfully',
      restaurant: restaurantData,
    });
  } catch (error) {
    console.error('Error registering restaurant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate restaurant signed message endpoint
app.post('/generate-signed-message', async (req, res) => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: restaurantId',
      });
    }

    console.log(
      `Génération d'un message signé pour le restaurant: ${restaurantId}`
    );

    // Generate a visit ID and timestamp
    const visitId = crypto.randomBytes(8).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000);

    // In a real implementation, this would use a crypto library to create
    // a proper signature with the restaurant's private key
    const signedMessage = {
      visit_id: visitId,
      timestamp,
      signature: `demo-signature-for-${restaurantId}-${visitId}`,
    };

    console.log('Message signé généré:', signedMessage);

    res.json({
      success: true,
      signedMessage: JSON.stringify(signedMessage),
    });
  } catch (error) {
    console.error('Error generating signed message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit review endpoint
app.post('/submit-review', async (req, res) => {
  try {
    const { restaurantId, clientName, reviewText, signedMessage } = req.body;

    if (!restaurantId || !clientName || !reviewText || !signedMessage) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: restaurantId, clientName, reviewText, signedMessage',
      });
    }

    console.log(`Soumission d'une review pour le restaurant: ${restaurantId}`);
    console.log('Données de la review:', {
      clientName,
      reviewText: reviewText.substring(0, 50) + '...',
    });

    // Verify the ZK proof
    const verificationResult = await verifyZkProof(
      signedMessage,
      'demo-public-key'
    );

    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        error: `ZK proof validation failed: ${verificationResult.reason}`,
      });
    }

    // Extract rating if present in the review text
    let rating = 5; // Default rating
    const ratingMatch = reviewText.match(/Rating: (\d+)\/5/);
    if (ratingMatch && ratingMatch[1]) {
      rating = parseInt(ratingMatch[1], 10);
    }

    // Generate unique ID for the review
    const reviewId = crypto.randomBytes(8).toString('hex');

    // Create review object with variants for different column names
    const reviewData = {
      id: reviewId,
      review_id: reviewId,
      restaurant_id: restaurantId,
      restaurantId: restaurantId,
      user_id: clientName, // Si la colonne est user_id
      user_name: clientName, // Si la colonne est user_name
      userName: clientName, // Si la colonne est userName
      review_text: reviewText,
      reviewText: reviewText,
      content: reviewText, // Une autre variante possible
      rating: rating,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      is_verified: true,
      isVerified: true,
      verification_id: verificationResult.verificationId,
      verificationId: verificationResult.verificationId,
    };

    console.log(
      "Tentative d'insertion dans Supabase avec les données:",
      reviewData
    );

    // Store the review in Supabase
    const { data, error } = await supabase.from('reviews').insert([reviewData]);

    if (error) {
      console.error(
        "Erreur lors de l'insertion de la review dans Supabase:",
        error
      );
      throw error;
    }

    console.log('Review enregistrée avec succès dans Supabase');

    res.json({
      success: true,
      message: 'Review submitted successfully!',
      review: reviewData,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reviews for a restaurant
app.get('/reviews/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ success: false, error: 'Restaurant ID is required' });
    }

    console.log(`Récupération des reviews pour le restaurant: ${restaurantId}`);

    // Get reviews from Supabase
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        'Erreur lors de la récupération des reviews depuis Supabase:',
        error
      );
      throw error;
    }

    console.log(
      `${data.length} reviews récupérées pour le restaurant ${restaurantId}`
    );

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// List all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    console.log('Récupération de tous les restaurants');

    // Get restaurants from Supabase
    const { data, error } = await supabase.from('restaurants').select('*');

    if (error) {
      console.error(
        'Erreur lors de la récupération des restaurants depuis Supabase:',
        error
      );
      throw error;
    }

    console.log(`${data.length} restaurants récupérés`);

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `[MOCK] Using simplified ZK proof validation with Supabase storage`
  );
});
