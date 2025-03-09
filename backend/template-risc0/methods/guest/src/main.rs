#![no_main]
#![no_std]

extern crate alloc;

use contract::RestaurantReview; // Utilisez le type de contrat approprié
use sdk::guest::execute;
use sdk::guest::GuestEnv;
use sdk::guest::Risc0Env;
use alloc::string::String;
use alloc::vec::Vec;
use alloc::string::ToString;
use alloc::format;
use serde::{Deserialize, Serialize};

risc0_zkvm::guest::entry!(main);

#[derive(Serialize, Deserialize)]
struct SignedMessage {
    visit_id: String,
    timestamp: u64,
    signature: String,
}

fn main() {
    //
    // Généralement, vous n'avez pas besoin de modifier ce fichier.
    // Sauf pour spécifier le type de votre contrat (ici = RestaurantReview)
    //

    let env = Risc0Env {};
    let input = env.read(); // Lire l'entrée de l'environnement
    
    // Parse the signed message and time range
    let message_str = unsafe { core::str::from_utf8_unchecked(&input[0]) };
    let signed_message: SignedMessage = serde_json::from_str(message_str).unwrap();
    
    let time_range_start_str = unsafe { core::str::from_utf8_unchecked(&input[1]) };
    let time_range_start: u64 = time_range_start_str.parse().unwrap();
    
    let time_range_end_str = unsafe { core::str::from_utf8_unchecked(&input[2]) };
    let time_range_end: u64 = time_range_end_str.parse().unwrap();
    
    // Verify the timestamp is within the valid range
    let timestamp = signed_message.timestamp;
    assert!(
        timestamp >= time_range_start && timestamp <= time_range_end,
        "Visit timestamp is outside the valid time range"
    );
    
    // Create output with the verified visit_id and timestamp
    let output = format!(
        "{{\"visit_id\":\"{}\",\"timestamp\":{}}}",
        signed_message.visit_id,
        timestamp
    );
    
    env.commit(output.as_bytes()); // Output the verification result
}