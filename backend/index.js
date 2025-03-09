const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to run Rust commands
const runRustCommand = async (command, args) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: path.join(__dirname, 'template-risc0'),
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error(`Command failed with code ${code}`);
        console.error(`stderr: ${stderr}`);
        reject(new Error(`Command failed: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
};

// Register contract endpoint
app.post('/register-contract', async (req, res) => {
  try {
    const result = await runRustCommand('cargo', ['run', 'RegisterContract']);
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

    const result = await runRustCommand('cargo', [
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

    // Generate a visit ID and timestamp
    const visitId = Math.random().toString(36).substring(2, 15);
    const timestamp = Math.floor(Date.now() / 1000);

    // In a real implementation, this would use a crypto library to create
    // a proper signature with the restaurant's private key
    const signedMessage = {
      visit_id: visitId,
      timestamp,
      signature: `dummy-signature-for-${restaurantId}-${visitId}`,
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

    const result = await runRustCommand('cargo', [
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
      message: 'Review submitted',
      result,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
