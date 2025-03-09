use borsh::{io::Error, BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};
use sdk::{Digestable, HyleContract, RunResult};

/// État du contrat
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
pub struct RestaurantReview {
    restaurants: std::collections::HashMap<String, Restaurant>, // Champ privé
    reviews: std::collections::HashMap<String, Vec<Review>>,    // Champ privé
}

/// Structure pour représenter un restaurant
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
pub struct Restaurant {
    pub public_key: Vec<u8>, // Clé publique du restaurant
}

/// Structure pour représenter une review
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
pub struct Review {
    pub client: String,
    pub review_text: String,
    pub zk_proof: Vec<u8>, // Preuve zkp
    pub timestamp: u64,
}

/// Actions possibles sur le contrat
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum RestaurantReviewAction {
    RegisterRestaurant { id: String, public_key: Vec<u8> },
    SubmitReview {
        restaurant_id: String,
        client: String,
        review_text: String,
        zk_proof: Vec<u8>,
        timestamp: u64,
    },
}

/// Implémentation des méthodes du contrat
impl RestaurantReview {
    /// Constructeur pour créer une nouvelle instance de RestaurantReview
    pub fn new() -> Self {
        RestaurantReview {
            restaurants: std::collections::HashMap::new(),
            reviews: std::collections::HashMap::new(),
        }
    }

    /// Enregistrer un restaurant
    pub fn register_restaurant(&mut self, id: String, public_key: Vec<u8>) {
        self.restaurants.insert(id, Restaurant { public_key });
    }

    /// Soumettre une review
    pub fn submit_review(
        &mut self,
        restaurant_id: String,
        client: String,
        review_text: String,
        zk_proof: Vec<u8>,
        timestamp: u64,
    ) -> Result<(), String> {
        // Vérifier que le restaurant existe
        if let Some(restaurant) = self.restaurants.get(&restaurant_id) {
            // Vérifier la preuve zkp (à implémenter avec Hylé)
            if self.verify_zk_proof(&zk_proof, &restaurant.public_key) {
                // Ajouter la review
                let review = Review {
                    client,
                    review_text,
                    zk_proof,
                    timestamp,
                };
                self.reviews.entry(restaurant_id).or_insert_with(Vec::new).push(review);
                Ok(())
            } else {
                Err("Invalid ZKP proof".to_string())
            }
        } else {
            Err("Restaurant not found".to_string())
        }
    }

    /// Vérifier la preuve zkp (placeholder)
    fn verify_zk_proof(&self, _proof: &[u8], _public_key: &[u8]) -> bool {
        // Logique de vérification de la preuve zkp (à implémenter avec Hylé)
        true // Placeholder
    }

    /// Convertir l'état en bytes
    pub fn as_bytes(&self) -> Result<Vec<u8>, Error> {
        borsh::to_vec(self)
    }
}

/// Implémentation de HyleContract pour RestaurantReview
impl HyleContract for RestaurantReview {
    /// Point d'entrée de la logique du contrat
    fn execute(&mut self, contract_input: &sdk::ContractInput) -> RunResult {
        // Analyser les entrées du contrat
        let (action, ctx) = sdk::utils::parse_raw_contract_input::<RestaurantReviewAction>(contract_input)?;

        // Exécuter la logique du contrat
        match action {
            RestaurantReviewAction::RegisterRestaurant { id, public_key } => {
                self.register_restaurant(id, public_key);
            }
            RestaurantReviewAction::SubmitReview {
                restaurant_id,
                client,
                review_text,
                timestamp,
            } => {
                self.submit_review(restaurant_id, client, review_text, timestamp)?;
            }
        }

        // Retourner un résultat (peut être utilisé pour donner un feedback à l'utilisateur)
        let program_output = "Action executed successfully".to_string();
        Ok((program_output, ctx, vec![]))
    }
}

/// Implémentation de Digestable pour RestaurantReview
impl Digestable for RestaurantReview {
    fn as_digest(&self) -> sdk::StateDigest {
        sdk::StateDigest(borsh::to_vec(self).expect("Failed to encode RestaurantReview"))
    }
}

/// Conversion de StateDigest en RestaurantReview
impl From<sdk::StateDigest> for RestaurantReview {
    fn from(state: sdk::StateDigest) -> Self {
        borsh::from_slice(&state.0)
            .map_err(|_| "Could not decode Hylar state".to_string())
            .unwrap()
    }
}

/// Utils pour le hôte
impl RestaurantReviewAction {
    pub fn as_blob(&self, contract_name: &str) -> sdk::Blob {
        sdk::Blob {
            contract_name: contract_name.into(),
            data: sdk::BlobData(borsh::to_vec(self).expect("failed to encode BlobData")),
        }
    }
}