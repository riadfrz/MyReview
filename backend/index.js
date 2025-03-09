const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for the hackathon demo
const restaurants = new Map();
const reviews = new Map();
let contractRegistered = false;

// Mock function that simulates running RISC0 commands
const mockRisc0Command = async (command, args) => {
  console.log(`[MOCK] Running command: ${command} ${args.join(' ')}`);

  // Add a small delay to simulate processing
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a mock transaction hash
  const txHash = crypto.randomBytes(16).toString('hex');

  if (args[0] === 'RegisterContract') {
    contractRegistered = true;
    return `✅ Contract registered. Hash of the transaction: ${txHash}`;
  }

  if (args[0] === 'RegisterRestaurant') {
    const id = args[1];
    const publicKey = args[2];
    restaurants.set(id, { publicKey });
    return `✅ Restaurant registered with ID: ${id}. Transaction hash: ${txHash}`;
  }

  if (args[0] === 'SubmitReview') {
    const restaurantId = args[1];
    const clientName = args[2];
    const reviewText = args[3];

    if (!restaurants.has(restaurantId)) {
      throw new Error(`Restaurant with ID ${restaurantId} not found`);
    }

    // Create a mock review object
    const review = {
      id: crypto.randomBytes(8).toString('hex'),
      restaurantId,
      clientName,
      reviewText,
      timestamp: Date.now(),
      verified: true, // In a real implementation, this would depend on the zk-proof verification
    };

    // Store the review
    if (!reviews.has(restaurantId)) {
      reviews.set(restaurantId, []);
    }
    reviews.get(restaurantId).push(review);

    return `✅ Review submitted successfully. Transaction hash: ${txHash}`;
  }

  return `✅ Command executed successfully. Transaction hash: ${txHash}`;
};

// Register contract endpoint
app.post('/register-contract', async (req, res) => {
  try {
    const result = await mockRisc0Command('cargo', ['run', 'RegisterContract']);
    res.json({ success: true, message: 'Contract registered', result });
  } catch (error) {
    console.error('Error registering contract:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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

    const result = await mockRisc0Command('cargo', [
      'run',
      'RegisterRestaurant',
      id,
      publicKey,
    ]);

    res.json({
      success: true,
      message: 'Restaurant registered',
      result,
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

    // Check if restaurant exists in our mock database
    if (!restaurants.has(restaurantId) && restaurants.size > 0) {
      // For demo purposes, if restaurantId doesn't exist but we have some restaurants,
      // use the first one we find
      const firstRestaurantId = Array.from(restaurants.keys())[0];
      console.log(
        `Restaurant ID ${restaurantId} not found, using ${firstRestaurantId} instead`
      );
    }

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

    // Parse the signed message
    const parsedMessage = JSON.parse(signedMessage);

    // In a real implementation, we would verify the signature here
    // For the hackathon, we'll just simulate success

    const result = await mockRisc0Command('cargo', [
      'run',
      'SubmitReview',
      restaurantId,
      clientName,
      reviewText,
      signedMessage,
      parsedMessage.timestamp.toString(),
    ]);

    res.json({
      success: true,
      message: 'Review submitted successfully!',
      result,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reviews for a restaurant
app.get('/reviews/:restaurantId', (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    return res
      .status(400)
      .json({ success: false, error: 'Restaurant ID is required' });
  }

  const restaurantReviews = reviews.get(restaurantId) || [];

  res.json({
    success: true,
    data: restaurantReviews,
  });
});

// List all restaurants (for demo purposes)
app.get('/restaurants', (req, res) => {
  const restaurantList = Array.from(restaurants.entries()).map(
    ([id, data]) => ({
      id,
      ...data,
    })
  );

  res.json({
    success: true,
    data: restaurantList,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`[MOCK] Using simulated RISC0 commands for hackathon demo`);
});
