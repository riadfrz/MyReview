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
  Prefer: 'count=exact',
};

async function getExistingUserAndRestaurant() {
  try {
    console.log("Recherche d'utilisateurs existants...");

    // Étape 1: Rechercher des utilisateurs existants
    const userResponse = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/users?select=*&limit=1`,
      headers,
    });

    if (!userResponse.data || userResponse.data.length === 0) {
      throw new Error(
        "Aucun utilisateur trouvé. Exécutez d'abord le SQL pour désactiver RLS."
      );
    }

    const user = userResponse.data[0];
    console.log('✅ Utilisateur existant trouvé:', user.id, user.email);

    // Étape 2: Rechercher des restaurants existants
    console.log('Recherche de restaurants existants...');
    const restaurantResponse = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/restaurants?select=*&limit=1`,
      headers,
    });

    let restaurant;
    if (!restaurantResponse.data || restaurantResponse.data.length === 0) {
      // Créer un restaurant
      console.log("Aucun restaurant trouvé, création d'un nouveau...");
      const newRestaurant = {
        id: uuidv4(),
        name: 'Restaurant Hackathon Demo',
        address: '123 Demo Street',
        avg_rating: 5.0,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const createResponse = await axios({
        method: 'POST',
        url: `${SUPABASE_URL}/rest/v1/restaurants`,
        headers,
        data: newRestaurant,
      });

      restaurant = newRestaurant;
      console.log(
        '✅ Nouveau restaurant créé:',
        restaurant.id,
        restaurant.name
      );
    } else {
      restaurant = restaurantResponse.data[0];
      console.log(
        '✅ Restaurant existant trouvé:',
        restaurant.id,
        restaurant.name
      );
    }

    return { user, restaurant };
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    throw error;
  }
}

async function createReview(user, restaurant) {
  try {
    console.log(
      `Création d'une review pour le restaurant ${restaurant.id} par l'utilisateur ${user.id}...`
    );

    // Vérifier si l'utilisateur a déjà laissé une review pour ce restaurant
    const checkResponse = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/reviews?restaurant_id=eq.${restaurant.id}&user_id=eq.${user.id}`,
      headers,
    });

    if (checkResponse.data && checkResponse.data.length > 0) {
      console.log(
        "⚠️ L'utilisateur a déjà laissé une review pour ce restaurant."
      );
      console.log('⚠️ Nous allons essayer de mettre à jour cette review...');

      const updateResponse = await axios({
        method: 'PATCH',
        url: `${SUPABASE_URL}/rest/v1/reviews?id=eq.${checkResponse.data[0].id}`,
        headers,
        data: {
          rating: 5,
          review_text: `Super restaurant! Review mise à jour: ${new Date().toLocaleString()}`,
          updated_at: new Date().toISOString(),
        },
      });

      console.log('✅ Review mise à jour avec succès!');
      return true;
    }

    // Créer une nouvelle review
    const review = {
      id: uuidv4(),
      restaurant_id: restaurant.id,
      user_id: user.id,
      rating: 5,
      review_text: `Excellent restaurant! Test hackathon: ${new Date().toLocaleString()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/reviews`,
      headers,
      data: review,
    });

    console.log('✅ Review créée avec succès!');
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);

    // Suggestions en cas d'erreur
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('\n❗ ERREUR RLS DÉTECTÉE ❗');
      console.log("Exécutez ce SQL dans l'éditeur Supabase:");
      console.log('------------------------------------');
      console.log('ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;');
      console.log('ALTER TABLE public.restaurants DISABLE ROW LEVEL SECURITY;');
      console.log('ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;');
      console.log(
        'ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_restaurant_id_user_id_key;'
      );
      console.log('------------------------------------');
    }

    throw error;
  }
}

async function main() {
  try {
    console.log('=== INSERTION DANS SUPABASE AVEC UTILISATEUR EXISTANT ===\n');

    // Obtenir un utilisateur et restaurant existants
    const { user, restaurant } = await getExistingUserAndRestaurant();

    // Créer une review
    await createReview(user, restaurant);

    console.log('\n=== SUCCÈS! ===');
    console.log('Une review a été créée/mise à jour dans Supabase.');
    console.log('Vérifiez dans Supabase: Table Editor > reviews');
  } catch (error) {
    console.error("\n❌ Échec de l'opération:", error.message);

    console.log('\n=== SOLUTION ALTERNATIVE ===');
    console.log('Pour votre hackathon, continuez avec le stockage local:');
    console.log('npm start');
    console.log(
      'Cela fonctionnera pour votre démonstration même sans Supabase.'
    );
  }
}

// Exécuter le script
main();
