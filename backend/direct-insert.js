#!/usr/bin/env node
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configuration Supabase
const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://pnrwovvrivhsozczzdpa.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucndvdnZyaXZoc296Y3p6ZHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNTA5OTcsImV4cCI6MjAyNTgyNjk5N30.P8saMOyD6_k8xUwIvzTBR54RxW9-wPj01TTiCGP5dnw';

// Headers API Supabase
const headers = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  Prefer: 'return=representation',
};

// Configuration pour le test
const demoConfig = {
  // Remplacez par un vrai ID utilisateur de votre base de données si nécessaire
  userId: uuidv4(),
  userName: 'Demo User',
  restaurantName: 'Restaurant Test Hackathon',
  reviewText: 'Très bon restaurant, service excellent! (Test Hackathon)',
};

async function directInsert() {
  try {
    console.log("===== TEST D'INSERTION DIRECTE DANS SUPABASE =====\n");
    console.log('Configuration: ', demoConfig);

    // Étape 1: Vérifier si l'utilisateur existe ou en créer un nouveau
    // Note: Cette étape échouera probablement à cause des restrictions RLS
    // mais nous essayons quand même
    console.log('\n--- Tentative de création utilisateur ---');
    try {
      const user = {
        id: demoConfig.userId,
        first_name: demoConfig.userName.split(' ')[0],
        last_name: demoConfig.userName.split(' ')[1] || '',
        email: `demo-${Date.now()}@example.com`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const userResponse = await axios({
        method: 'POST',
        url: `${SUPABASE_URL}/rest/v1/users`,
        headers,
        data: user,
      });

      console.log('✅ Utilisateur créé avec succès:', userResponse.data);
    } catch (error) {
      console.log(
        '⚠️ Erreur lors de la création utilisateur:',
        error.response?.status,
        error.response?.data?.message || error.message
      );
      console.log(
        "Nous continuons avec l'ID utilisateur configuré:",
        demoConfig.userId
      );
    }

    // Étape 2: Créer un restaurant
    console.log('\n--- Tentative de création restaurant ---');
    const restaurantId = uuidv4();
    try {
      const restaurant = {
        id: restaurantId,
        name: demoConfig.restaurantName,
        address: '123 Test Street',
        avg_rating: 5,
        user_id: demoConfig.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const restaurantResponse = await axios({
        method: 'POST',
        url: `${SUPABASE_URL}/rest/v1/restaurants`,
        headers,
        data: restaurant,
      });

      console.log('✅ Restaurant créé avec succès:', restaurant.name);
    } catch (error) {
      console.log(
        '⚠️ Erreur lors de la création restaurant:',
        error.response?.status,
        error.response?.data?.message || error.message
      );
      console.log(
        'Nous continuons avec un restaurant ID généré:',
        restaurantId
      );
    }

    // Étape 3: Créer une review
    console.log('\n--- Tentative de création review ---');
    try {
      const review = {
        id: uuidv4(),
        restaurant_id: restaurantId,
        user_id: demoConfig.userId,
        rating: 5,
        review_text: demoConfig.reviewText,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const reviewResponse = await axios({
        method: 'POST',
        url: `${SUPABASE_URL}/rest/v1/reviews`,
        headers,
        data: review,
      });

      console.log('✅ Review créée avec succès!');
      console.log('Contenu:', review.review_text);
      console.log('\n=== SUCCÈS! ===');
      console.log(
        '\nImportant: Si vous avez rencontré des erreurs mais que la dernière étape a réussi,'
      );
      console.log(
        "cela signifie que l'insertion de review fonctionne, ce qui est l'essentiel pour votre démo."
      );
    } catch (error) {
      console.log(
        '❌ Erreur lors de la création review:',
        error.response?.status,
        error.response?.data?.message || error.message
      );
      console.log('\n=== IMPORTANT ===');
      console.log(
        'Si vous voyez une erreur RLS (row-level security), vous devez exécuter le SQL manuellement:'
      );
      console.log('1. Allez sur https://pnrwovvrivhsozczzdpa.supabase.co');
      console.log('2. Ouvrez "SQL Editor" dans le menu de gauche');
      console.log('3. Créez une nouvelle requête (New Query)');
      console.log('4. Copiez-collez le contenu du fichier rls-commands.sql');
      console.log('5. Exécutez la requête en cliquant sur "Run"');
      console.log('6. Réessayez cette commande après: npm run simple-insert');
    }
  } catch (error) {
    console.error('Erreur générale:', error.message);
  }
}

// Exécuter le script
directInsert();
