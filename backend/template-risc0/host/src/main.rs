use anyhow::Result;
use clap::{Parser, Subcommand};
use client_sdk::helpers::risc0::Risc0Prover;
use contract::{RestaurantReview, RestaurantReviewAction};
use sdk::api::APIRegisterContract;
use sdk::{BlobTransaction, ProofTransaction};
use sdk::{ContractInput, Digestable};

// Ces constantes représentent l'ELF RISC-V et l'ID d'image généré par risc0-build.
// L'ELF est utilisé pour prouver et l'ID pour vérifier.
use methods::{GUEST_ELF, GUEST_ID};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    #[arg(long, default_value = "http://localhost:4321")]
    pub host: String,

    #[arg(long, default_value = "restaurant_review")]
    pub contract_name: String,
}

#[derive(Subcommand)]
enum Commands {
    RegisterContract {},
    RegisterRestaurant {
        id: String,
        public_key: String,
    },
    SubmitReview {
        restaurant_id: String,
        client_name: String,
        review_text: String,
        signed_message: String,
        timestamp: u64,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // Client pour envoyer des requêtes au nœud
    let client = client_sdk::rest_client::NodeApiHttpClient::new(cli.host)?;
    let contract_name = &cli.contract_name;

    // Utilisé pour générer des preuves zk de l'exécution.
    let prover = Risc0Prover::new(GUEST_ELF);

    // Cet exemple utilise une identité factice. Les identités sont des champs obligatoires.
    let identity = format!("none.{}", contract_name);

    match cli.command {
        Commands::RegisterContract {} => {
            // Construire l'état initial du contrat
            let initial_state = RestaurantReview::new();

            // Envoyer la transaction pour enregistrer le contrat
            let res = client
                .register_contract(&APIRegisterContract {
                    verifier: "risc0".into(),
                    program_id: sdk::ProgramId(sdk::to_u8_array(&GUEST_ID).to_vec()),
                    state_digest: initial_state.as_digest(),
                    contract_name: contract_name.clone().into(),
                })
                .await?;
            println!("✅ Contrat enregistré. Hash de la transaction : {}", res);
        }
        Commands::RegisterRestaurant { id, public_key } => {
            // Construire l'action pour enregistrer un restaurant
            let action = RestaurantReviewAction::RegisterRestaurant {
                id,
                public_key: public_key.into_bytes(),
            };

            // Construire la transaction blob
            let blobs = vec![action.as_blob(contract_name)];
            let blob_tx = BlobTransaction::new(identity.clone(), blobs.clone());

            // Envoyer la transaction blob
            let blob_tx_hash = client.send_tx_blob(&blob_tx).await.unwrap();
            println!("✅ Transaction blob envoyée. Hash : {}", blob_tx_hash);

            // Générer la preuve zk
            let inputs = ContractInput {
                state: Vec::new(), // État initial non nécessaire pour cette action
                identity: identity.clone().into(),
                tx_hash: blob_tx_hash,
                private_input: vec![],
                tx_ctx: None,
                blobs: blobs.clone(),
                index: sdk::BlobIndex(0),
            };

            let proof = prover.prove(inputs).await.unwrap();

            // Construire la transaction de preuve
            let proof_tx = ProofTransaction {
                proof,
                contract_name: contract_name.clone().into(),
            };

            // Envoyer la transaction de preuve
            let proof_tx_hash = client.send_tx_proof(&proof_tx).await.unwrap();
            println!("✅ Transaction de preuve envoyée. Hash : {}", proof_tx_hash);
        }
        
        
        Commands::SubmitReview {
            restaurant_id,
            client_name,
            review_text,
            signed_message,
            timestamp,
        } => {
            // Generate the zk proof from the signed message
            // Calculate time range (last 30 days)
            let current_time = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs();
            let time_range_start = current_time - (30 * 24 * 60 * 60); // 30 days ago
            let time_range_end = current_time;
            
            // Prepare inputs for the zk proof generation
            let inputs = vec![
                signed_message.as_bytes().to_vec(),
                time_range_start.to_string().as_bytes().to_vec(),
                time_range_end.to_string().as_bytes().to_vec(),
            ];
            
            // Generate the zk proof
            let (proof, journal) = prover.prove_inputs(&inputs).await.unwrap();
            println!("✅ ZK Proof generated successfully");
            println!("Journal: {}", String::from_utf8_lossy(&journal));
            
            // Construct the action to submit a review with the generated proof
            let action = RestaurantReviewAction::SubmitReview {
                restaurant_id,
                client: client_name,
                review_text,
                zk_proof: proof.to_vec(),
                timestamp,
            };

            // Build the blob transaction
            let blobs = vec![action.as_blob(contract_name)];
            let blob_tx = BlobTransaction::new(identity.clone(), blobs.clone());

            // Send the blob transaction
            let blob_tx_hash = client.send_tx_blob(&blob_tx).await.unwrap();
            println!("✅ Blob transaction sent. Hash: {}", blob_tx_hash);

            // Generate the zk proof for the contract execution
            let inputs = ContractInput {
                state: Vec::new(),
                identity: identity.clone().into(),
                tx_hash: blob_tx_hash,
                private_input: vec![],
                tx_ctx: None,
                blobs: blobs.clone(),
                index: sdk::BlobIndex(0),
            };

            let proof = prover.prove(inputs).await.unwrap();

            // Build the proof transaction
            let proof_tx = ProofTransaction {
                proof,
                contract_name: contract_name.clone().into(),
            };

            // Send the proof transaction
            let proof_tx_hash = client.send_tx_proof(&proof_tx).await.unwrap();
            println!("✅ Proof transaction sent. Hash: {}", proof_tx_hash);
        }
    }
    Ok(())
}



