#!/usr/bin/env node
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3002';
const restaurantId = process.argv[2] || 'restaurant123';
const publicKey = process.argv[3] || 'demo-public-key-' + Date.now();

async function registerRestaurant() {
  try {
    console.log(
      `Enregistrement du restaurant avec ID: ${restaurantId} et clé publique: ${publicKey}`
    );

    // Enregistrer le restaurant directement
    const response = await axios.post(`${API_URL}/register-restaurant`, {
      id: restaurantId,
      publicKey,
    });

    console.log('✅ Enregistrement réussi!');
    console.log(JSON.stringify(response.data, null, 2));
    console.log(
      '\nVous pouvez maintenant utiliser cet ID de restaurant pour soumettre des reviews.'
    );
    console.log(
      `Essayez de visiter: http://localhost:5173/verified-review/${restaurantId}`
    );
  } catch (error) {
    console.error("❌ Échec de l'enregistrement:");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    console.error(
      "\nAssurez-vous que le serveur backend est en cours d'exécution (npm start dans le répertoire backend)"
    );
  }
}

// Exécuter
registerRestaurant();
