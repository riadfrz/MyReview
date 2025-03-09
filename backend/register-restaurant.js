#!/usr/bin/env node
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3002';
const restaurantId = process.argv[2] || 'restaurant123';
const publicKey = process.argv[3] || 'demo-public-key-' + Date.now();

async function registerRestaurant() {
  try {
    console.log(
      `Registering restaurant with ID: ${restaurantId} and public key: ${publicKey}`
    );

    // First register the contract if not already done
    console.log('Registering contract...');
    await axios.post(`${API_URL}/register-contract`);

    // Then register the restaurant
    console.log('Registering restaurant...');
    const response = await axios.post(`${API_URL}/register-restaurant`, {
      id: restaurantId,
      publicKey,
    });

    console.log('✅ Registration successful!');
    console.log(response.data.result);
    console.log('\nYou can now use this restaurant ID to submit reviews.');
    console.log(
      `Try visiting: http://localhost:5173/verified-review/${restaurantId}`
    );
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    console.error(
      '\nMake sure the backend server is running (npm start in the backend directory)'
    );
  }
}

// Execute
registerRestaurant();
