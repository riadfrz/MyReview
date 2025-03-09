const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs').promises;
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Stockage local (en mémoire)
const localDb = {
  restaurants: new Map(),
  reviews: new Map(),
  users: new Map(),
};

// Tenter d'utiliser Supabase, mais avoir un fallback en stockage local
let useSupabase = false;
let supabase = null;

try {
  // Configuration Supabase
  const supabaseUrl =
    process.env.SUPABASE_URL || 'https://vbqnelafdhblvefuvkrw.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZicW5lbGFmZGhibHZlZnV2a3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNTA5OTcsImV4cCI6MjAyNTgyNjk5N30.jYYLQswUqOg_iKxeZjfE4dz-m1SrPwQsGkdnP_A39uk';

  console.log('Configuration Supabase:');
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log(
    'SUPABASE_KEY:',
    supabaseKey ? 'Key is defined (not showing for security)' : 'Key is missing'
  );

  // Options supplémentaires pour Supabase
  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (url, options) => {
        // Log des requêtes
        console.log(`Supabase request to: ${url.substring(0, 50)}...`);
        return fetch(url, {
          ...options,
          // On ajoute un timeout pour éviter les attentes trop longues
          signal: AbortSignal.timeout(5000),
        });
      },
    },
  };

  // Créer le client Supabase avec options
  supabase = createClient(supabaseUrl, supabaseKey, options);
  console.log('Supabase client initialized:', !!supabase);

  // On vérifiera la connexion à Supabase au premier appel API
  useSupabase = false; // Par défaut, on n'utilise pas Supabase jusqu'à confirmation
} catch (error) {
  console.error("Erreur lors de l'initialisation de Supabase:", error.message);
  console.log('⚠️ Utilisation du stockage local');
  useSupabase = false;
}

// Tenter de charger les données depuis le stockage local (fichier)
(async () => {
  try {
    const dataPath = path.join(__dirname, 'local-data.json');

    try {
      // Tenter de lire le fichier de données locales
      const data = await fs.readFile(dataPath, 'utf8');
      const jsonData = JSON.parse(data);

      // Convertir les données en Maps pour utilisation en mémoire
      if (jsonData.restaurants) {
        jsonData.restaurants.forEach((restaurant) => {
          localDb.restaurants.set(restaurant.id, restaurant);
        });
        console.log(
          `✅ ${jsonData.restaurants.length} restaurants chargés depuis le stockage local`
        );
      }

      if (jsonData.reviews) {
        jsonData.reviews.forEach((review) => {
          if (!localDb.reviews.has(review.restaurant_id)) {
            localDb.reviews.set(review.restaurant_id, []);
          }
          localDb.reviews.get(review.restaurant_id).push(review);
        });
        console.log(
          `✅ ${jsonData.reviews.length} reviews chargées depuis le stockage local`
        );
      }

      if (jsonData.users) {
        jsonData.users.forEach((user) => {
          localDb.users.set(user.id, user);
        });
        console.log(
          `✅ ${jsonData.users.length} utilisateurs chargés depuis le stockage local`
        );
      }
    } catch (err) {
      // Si le fichier n'existe pas ou est invalide, on commence avec des données vides
      if (err.code === 'ENOENT') {
        console.log(
          '⚠️ Aucune donnée locale trouvée, démarrage avec base de données vide'
        );
      } else {
        console.error(
          'Erreur lors de la lecture des données locales:',
          err.message
        );
      }
    }

    // Tenter de connecter à Supabase si configuré
    if (supabase) {
      try {
        console.log('Tentative de connexion à Supabase...');
        const { data, error } = await supabase
          .from('restaurants')
          .select('count')
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        console.log('✅ Connexion à Supabase établie avec succès');
        useSupabase = true;
      } catch (error) {
        console.error('❌ Erreur de connexion à Supabase:', error.message);
        console.log('⚠️ Utilisation du stockage local uniquement');
        useSupabase = false;
      }
    }
  } catch (err) {
    console.error("Erreur lors de l'initialisation:", err);
  }
})();

// Fonction pour sauvegarder les données locales dans un fichier
const saveLocalData = async () => {
  try {
    const dataPath = path.join(__dirname, 'local-data.json');

    // Convertir les Maps en tableaux pour le stockage JSON
    const jsonData = {
      restaurants: Array.from(localDb.restaurants.values()),
      reviews: Array.from(localDb.reviews.values()).flat(),
      users: Array.from(localDb.users.values()),
    };

    await fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log('✅ Données locales sauvegardées');
  } catch (err) {
    console.error(
      '❌ Erreur lors de la sauvegarde des données locales:',
      err.message
    );
  }
};

// Créer un utilisateur démo si nécessaire
const getOrCreateDemoUser = async () => {
  const demoUserEmail = 'demo@example.com';

  // Vérifier si l'utilisateur existe déjà
  if (useSupabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', demoUserEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        console.log('Utilisateur démo existant trouvé dans Supabase');
        return data;
      }

      // Créer l'utilisateur s'il n'existe pas
      const demoUser = {
        id: uuidv4(),
        first_name: 'Demo',
        last_name: 'User',
        email: demoUserEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert([demoUser]);

      if (insertError) {
        throw insertError;
      }

      console.log('✅ Utilisateur démo créé dans Supabase');
      return demoUser;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la création de l'utilisateur démo dans Supabase:",
        error.message
      );
      console.log("⚠️ Utilisation d'un utilisateur démo local");
      useSupabase = false;
      // Fallback to local user
    }
  }

  // Stockage local
  let demoUser = Array.from(localDb.users.values()).find(
    (u) => u.email === demoUserEmail
  );

  if (!demoUser) {
    demoUser = {
      id: uuidv4(),
      first_name: 'Demo',
      last_name: 'User',
      email: demoUserEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localDb.users.set(demoUser.id, demoUser);
    await saveLocalData();
    console.log('✅ Utilisateur démo créé localement');
  }

  return demoUser;
};

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

    // Obtenir ou créer l'utilisateur démo
    const demoUser = await getOrCreateDemoUser();

    // Générer un UUID pour le restaurant
    const restaurantId = uuidv4();

    // Créer l'objet restaurant conformément au schéma Supabase
    const restaurantData = {
      id: restaurantId,
      name: `Restaurant ${id}`,
      address: '123 Main Street', // Champ obligatoire dans votre schéma
      avg_rating: 0,
      user_id: demoUser.id,
      public_key: publicKey, // Champ personnalisé pour notre application
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Stocker le restaurant
    if (useSupabase) {
      // Utiliser Supabase
      const { error } = await supabase
        .from('restaurants')
        .upsert([restaurantData]);

      if (error) {
        console.error("❌ Erreur lors de l'insertion dans Supabase:", error);
        throw error;
      }

      console.log('Restaurant enregistré avec succès dans Supabase');
    } else {
      // Utiliser le stockage local
      localDb.restaurants.set(restaurantId, restaurantData);
      console.log('Restaurant enregistré en stockage local');

      // Sauvegarder dans le fichier
      await saveLocalData();
    }

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

    // Obtenir ou créer l'utilisateur démo
    const demoUser = await getOrCreateDemoUser();

    // Trouver le restaurant (par l'ID transmis ou un restaurant existant)
    let targetRestaurant = null;

    if (useSupabase) {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name')
        .eq('id', restaurantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Si le restaurant spécifique n'est pas trouvé, chercher n'importe quel restaurant
        const { data: anyRestaurant, error: anyError } = await supabase
          .from('restaurants')
          .select('id, name')
          .limit(1)
          .maybeSingle();

        if (anyError && anyError.code !== 'PGRST116') {
          throw anyError;
        }

        targetRestaurant = anyRestaurant;

        if (!targetRestaurant) {
          // Si aucun restaurant n'existe, en créer un
          const newRestaurantId = uuidv4();
          const newRestaurant = {
            id: newRestaurantId,
            name: 'Demo Restaurant',
            address: '123 Main Street',
            avg_rating: 0,
            user_id: demoUser.id,
            public_key: 'demo-key',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: insertError } = await supabase
            .from('restaurants')
            .insert([newRestaurant]);

          if (insertError) {
            throw insertError;
          }

          targetRestaurant = newRestaurant;
        }
      } else {
        targetRestaurant = data;
      }
    } else {
      // Stockage local
      targetRestaurant = localDb.restaurants.get(restaurantId);

      if (!targetRestaurant) {
        // Si le restaurant spécifique n'est pas trouvé, prendre le premier restaurant disponible
        if (localDb.restaurants.size > 0) {
          targetRestaurant = Array.from(localDb.restaurants.values())[0];
        } else {
          // Si aucun restaurant n'existe, en créer un
          const newRestaurantId = uuidv4();
          const newRestaurant = {
            id: newRestaurantId,
            name: 'Demo Restaurant',
            address: '123 Main Street',
            avg_rating: 0,
            user_id: demoUser.id,
            public_key: 'demo-key',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          localDb.restaurants.set(newRestaurantId, newRestaurant);
          await saveLocalData();

          targetRestaurant = newRestaurant;
        }
      }
    }

    console.log('Restaurant cible pour la review:', targetRestaurant);

    // Générer un UUID pour la review
    const reviewId = uuidv4();

    // Create review object conforme au schéma Supabase
    const reviewData = {
      id: reviewId,
      restaurant_id: targetRestaurant.id,
      user_id: demoUser.id,
      rating: rating,
      review_text: reviewText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Version locale avec des champs supplémentaires
    const localReviewData = {
      ...reviewData,
      client_name: clientName,
      is_verified: true,
      verification_id: verificationResult.verificationId,
    };

    console.log('Données de la review à soumettre:', reviewData);

    // Store the review
    if (useSupabase) {
      // Utiliser Supabase avec uniquement les champs qui existent dans le schéma
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select();

      if (error) {
        console.error(
          "❌ Erreur lors de l'insertion de la review dans Supabase:",
          error
        );
        throw error;
      }

      console.log('Review enregistrée avec succès dans Supabase:', data);
    } else {
      // Utiliser le stockage local - ici on peut stocker tous les champs
      if (!localDb.reviews.has(targetRestaurant.id)) {
        localDb.reviews.set(targetRestaurant.id, []);
      }
      localDb.reviews.get(targetRestaurant.id).push(localReviewData);
      console.log('Review enregistrée en stockage local');

      // Sauvegarder dans le fichier
      await saveLocalData();
    }

    res.json({
      success: true,
      message: 'Review submitted successfully!',
      review: useSupabase ? reviewData : localReviewData,
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

    let reviewsData = [];

    if (useSupabase) {
      // Utiliser Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*, users:user_id(first_name, last_name, email)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      reviewsData = data;
      console.log(`${data.length} reviews récupérées depuis Supabase`);
    } else {
      // Utiliser le stockage local
      reviewsData = localDb.reviews.get(restaurantId) || [];

      // Enrichir les reviews avec les données utilisateur
      reviewsData = reviewsData.map((review) => {
        const user = localDb.users.get(review.user_id);
        return {
          ...review,
          users: user || null,
        };
      });

      // Trier par date de création (les plus récentes d'abord)
      reviewsData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      console.log(
        `${reviewsData.length} reviews récupérées depuis le stockage local`
      );
    }

    res.json({
      success: true,
      data: reviewsData,
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

    let restaurantsData = [];

    if (useSupabase) {
      // Utiliser Supabase
      const { data, error } = await supabase.from('restaurants').select('*');

      if (error) {
        throw error;
      }

      restaurantsData = data;
      console.log(`${data.length} restaurants récupérés depuis Supabase`);
    } else {
      // Utiliser le stockage local
      restaurantsData = Array.from(localDb.restaurants.values());
      console.log(
        `${restaurantsData.length} restaurants récupérés depuis le stockage local`
      );
    }

    res.json({
      success: true,
      data: restaurantsData,
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
    `[MOCK] Using simplified ZK proof validation with ${
      useSupabase ? 'Supabase' : 'local'
    } storage`
  );
});
