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

    // Store restaurant in Supabase
    const { data, error } = await supabase
      .from('restaurants')
      .upsert([
        {
          id: id,
          public_key: publicKey,
          name: `Restaurant ${id}`, // Default name
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    // Also keep in memory for quick reference
    restaurants.set(id, { publicKey });

    res.json({
      success: true,
      message: 'Restaurant registered successfully',
      restaurant: data[0],
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

    // Check if restaurant exists in Supabase
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('id, public_key')
      .eq('id', restaurantId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If restaurant doesn't exist, try to find any restaurant
    let targetRestaurantId = restaurantId;
    if (!restaurant) {
      const { data: firstRestaurant, error: fetchError } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (firstRestaurant) {
        targetRestaurantId = firstRestaurant.id;
        console.log(
          `Restaurant ID ${restaurantId} not found, using ${targetRestaurantId} instead`
        );
      }
    }

    // Generate a visit ID and timestamp
    const visitId = crypto.randomBytes(8).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000);

    // In a real implementation, this would use a crypto library to create
    // a proper signature with the restaurant's private key
    const signedMessage = {
      visit_id: visitId,
      timestamp,
      signature: `demo-signature-for-${targetRestaurantId}-${visitId}`,
    };

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

    // Get restaurant public key from Supabase
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('public_key')
      .eq('id', restaurantId)
      .single();

    if (restaurantError && restaurantError.code !== 'PGRST116') {
      throw restaurantError;
    }

    const publicKey = restaurant ? restaurant.public_key : 'demo-public-key';

    // Verify the ZK proof
    const verificationResult = await verifyZkProof(signedMessage, publicKey);

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

    // Create review object for Supabase
    const reviewData = {
      id: crypto.randomBytes(8).toString('hex'),
      restaurant_id: restaurantId,
      user_name: clientName,
      review_text: reviewText,
      rating: rating,
      created_at: new Date().toISOString(),
      is_verified: true,
      verification_id: verificationResult.verificationId,
    };

    // Store the review in Supabase
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Review submitted successfully!',
      review: data[0],
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

    // Get reviews from Supabase
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

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
    // Get restaurants from Supabase
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

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
