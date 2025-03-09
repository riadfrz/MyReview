# MyReview - Verified Restaurant Reviews with Zero-Knowledge Proofs

MyReview is a web application that allows customers to submit verified restaurant reviews using zero-knowledge proofs (zk-proofs) on the Hylé blockchain. This ensures that only customers who have actually visited a restaurant can leave reviews, while preserving their privacy.

## Project Overview

The application consists of three main components:

1. **Frontend (React/TypeScript)**: User interface for submitting and viewing reviews
2. **Backend (Node.js)**: Middleware that connects the frontend to the blockchain
3. **Smart Contract (Rust)**: Stores verified reviews on the Hylé blockchain

## How It Works

1. A restaurant generates a signed message (e.g., via QR code) containing a `visit_id` and `timestamp` at the end of a customer's visit
2. The customer uploads this signed message to generate a zk-proof that verifies their recent visit (within 30 days) without revealing exact details
3. The Hylé blockchain verifies this proof and records the review if valid
4. Other users can view verified reviews, knowing they come from actual customers

## Project Structure

```
MyReview/
├── backend/                  # Backend Node.js server
│   ├── template-risc0/       # Rust code for zk-proof generation
│   │   ├── methods/          # Guest code for the zkVM
│   │   ├── host/             # Host code for blockchain interaction
│   │   └── contract/         # Smart contract implementation
│   └── index.js              # Express server for API endpoints
└── MyReview/                 # Frontend React application
    └── src/
        ├── components/       # React components
        ├── pages/            # Page components
        └── routes/           # Application routing
```

## Prerequisites

- Node.js (v16+)
- Rust (with the `nightly` toolchain)
- Docker (for running a local Hylé node)

## Setup and Installation

### 1. Start the Hylé Node

```bash
# Pull and run the Hylé node Docker image
docker run -p 4321:4321 hyle/hyle-node
```

### 2. Build and Run the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Build the Rust components
cd template-risc0
cargo build

# Register the contract
cargo run RegisterContract

# Start the Node.js server
cd ..
npm run dev
```

### 3. Run the Frontend

```bash
# Navigate to the frontend directory
cd MyReview

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. **Restaurant Registration**: Register a restaurant with its public key

   ```bash
   cd backend/template-risc0
   cargo run RegisterRestaurant <restaurant_id> <public_key>
   ```

2. **Customer Review Submission**:
   - Visit the application at `http://localhost:5173`
   - Navigate to `/verified-review/<restaurant_id>`
   - Upload the signed message from the restaurant or generate a test one
   - Fill in the review details and submit

## Development

### Backend API Endpoints

- `POST /register-contract`: Register the smart contract on the blockchain
- `POST /register-restaurant`: Register a new restaurant with its public key
- `POST /generate-signed-message`: Generate a test signed message (for demo purposes)
- `POST /submit-review`: Submit a verified review with a zk-proof

### Frontend Routes

- `/`: Landing page
- `/dashboard`: User dashboard
- `/verified-review/:restaurantId`: Submit a verified review for a specific restaurant

## Troubleshooting

If you encounter the error `Sending tx blob request failed`, ensure that:

1. The Hylé node is running at `http://localhost:4321`
2. The guest program has been properly registered
3. The contract has been registered before attempting to submit reviews

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Hylé Blockchain](https://github.com/Hyle-org/hyle) for providing the zero-knowledge proof infrastructure
- [RISC Zero](https://www.risczero.com/) for the zkVM implementation
