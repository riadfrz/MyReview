#!/usr/bin/env node
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Configuration Supabase (à mettre à jour avec vos vraies valeurs)
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

// Fonction pour insérer directement un utilisateur
async function insertUser() {
  try {
    console.log('Connexion directe à Supabase via API REST...');

    // Créer un utilisateur demo
    const demoUser = {
      id: uuidv4(),
      first_name: 'Demo',
      last_name: 'User',
      email: `demo${Date.now()}@example.com`, // Email unique
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insérer l'utilisateur via l'API REST
    const userResponse = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/users`,
      headers,
      data: demoUser,
    });

    console.log('✅ Utilisateur créé avec succès:', userResponse.data);
    return demoUser;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'insertion utilisateur:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Fonction pour insérer directement un restaurant
async function insertRestaurant(userId) {
  try {
    // Créer un restaurant
    const restaurant = {
      id: uuidv4(),
      name: `Test Restaurant ${Date.now()}`,
      address: '123 Test Street',
      avg_rating: 0,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insérer le restaurant via l'API REST
    const restaurantResponse = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/restaurants`,
      headers,
      data: restaurant,
    });

    console.log('✅ Restaurant créé avec succès:', restaurantResponse.data);
    return restaurant;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'insertion restaurant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Fonction pour insérer directement une review
async function insertReview(userId, restaurantId) {
  try {
    // Créer une review
    const review = {
      id: uuidv4(),
      restaurant_id: restaurantId,
      user_id: userId,
      rating: 5,
      review_text: `Test review at ${new Date().toLocaleString()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insérer la review via l'API REST
    const reviewResponse = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/reviews`,
      headers,
      data: review,
    });

    console.log('✅ Review créée avec succès:', reviewResponse.data);
    return review;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'insertion review:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Fonction principale
async function main() {
  try {
    console.log('-------------------------------------------------');
    console.log('INSERTION DIRECTE DANS SUPABASE VIA API REST');
    console.log('-------------------------------------------------');

    // 1. Insérer un utilisateur
    const user = await insertUser();
    console.log('\n');

    // 2. Insérer un restaurant
    const restaurant = await insertRestaurant(user.id);
    console.log('\n');

    // 3. Insérer une review
    const review = await insertReview(user.id, restaurant.id);
    console.log('\n');

    console.log('✅ SUCCÈS! Toutes les insertions ont réussi');
    console.log(
      `Vérifiez dans Supabase: https://pnrwovvrivhsozczzdpa.supabase.co`
    );
  } catch (error) {
    console.error("❌ Processus interrompu à cause d'une erreur");
  }
}

// Exécution
main();
