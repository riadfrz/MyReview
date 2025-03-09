use super::*;
use anyhow::Result;
use client_sdk::rest_client::NodeApiHttpClient;
use contract::{RestaurantReview, RestaurantReviewAction};
use sdk::{BlobTransaction, ContractInput, ProofTransaction};
use methods::{GUEST_ELF};

#[tokio::test]
async fn test_register_restaurant() -> Result<()> {
    // Simuler un client pour envoyer des requêtes au nœud
    let client = NodeApiHttpClient::new("http://localhost:4321")?;
    let contract_name = "restaurant_review";

    // Construire l'action pour enregistrer un restaurant
    let action = RestaurantReviewAction::RegisterRestaurant {
        id: "restaurant_1".to_string(),
        public_key: "public_key_123".to_string().into_bytes(),
    };

    // Construire la transaction blob
    let blobs = vec![action.as_blob(contract_name)];
    let blob_tx = BlobTransaction::new("identity".to_string(), blobs.clone());

    // Envoyer la transaction blob
    let blob_tx_hash = client.send_tx_blob(&blob_tx).await?;
    println!("✅ Transaction blob envoyée. Hash : {}", blob_tx_hash);

    // Générer la preuve zk
    let inputs = ContractInput {
        state: Vec::new(), // État initial non nécessaire pour cette action
        identity: "identity".to_string(),
        tx_hash: blob_tx_hash.clone(),
        private_input: vec![],
        tx_ctx: None,
        blobs: blobs.clone(),
        index: sdk::BlobIndex(0),
    };

    let prover = Risc0Prover::new(GUEST_ELF);
    let proof = prover.prove(inputs).await?;

    // Construire la transaction de preuve
    let proof_tx = ProofTransaction {
        proof,
        contract_name: contract_name.to_string(),
    };

    // Envoyer la transaction de preuve
    let proof_tx_hash = client.send_tx_proof(&proof_tx).await?;
    println!("✅ Transaction de preuve envoyée. Hash : {}", proof_tx_hash);

    Ok(())
}

#[tokio::test]
async fn test_submit_review() -> Result<()> {
    // Simuler un client pour envoyer des requêtes au nœud
    let client = NodeApiHttpClient::new("http://localhost:4321")?;
    let contract_name = "restaurant_review";

    // Construire l'action pour soumettre une review
    let action = RestaurantReviewAction::SubmitReview {
        restaurant_id: "restaurant_1".to_string(),
        client: "client_1".to_string(),
        review_text: "Great service!".to_string(),
        zk_proof: "zk_proof_123".to_string().into_bytes(),
        timestamp: 1730984240,
    };

    // Construire la transaction blob
    let blobs = vec![action.as_blob(contract_name)];
    let blob_tx = BlobTransaction::new("identity".to_string(), blobs.clone());

    // Envoyer la transaction blob
    let blob_tx_hash = client.send_tx_blob(&blob_tx).await?;
    println!("✅ Transaction blob envoyée. Hash : {}", blob_tx_hash);

    // Générer la preuve zk
    let inputs = ContractInput {
        state: Vec::new(), // État initial non nécessaire pour cette action
        identity: "identity".to_string(),
        tx_hash: blob_tx_hash.clone(),
        private_input: vec![],
        tx_ctx: None,
        blobs: blobs.clone(),
        index: sdk::BlobIndex(0),
    };

    let prover = Risc0Prover::new(GUEST_ELF);
    let proof = prover.prove(inputs).await?;

    // Construire la transaction de preuve
    let proof_tx = ProofTransaction {
        proof,
        contract_name: contract_name.to_string(),
    };

    // Envoyer la transaction de preuve
    let proof_tx_hash = client.send_tx_proof(&proof_tx).await?;
    println!("✅ Transaction de preuve envoyée. Hash : {}", proof_tx_hash);

    Ok(())
}