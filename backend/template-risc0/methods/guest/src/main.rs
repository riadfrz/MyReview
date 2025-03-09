#![no_main]
#![no_std]

extern crate alloc;

use contract::RestaurantReview; // Utilisez le type de contrat approprié
use sdk::guest::execute;
use sdk::guest::GuestEnv;
use sdk::guest::Risc0Env;

risc0_zkvm::guest::entry!(main);

fn main() {
    //
    // Généralement, vous n'avez pas besoin de modifier ce fichier.
    // Sauf pour spécifier le type de votre contrat (ici = RestaurantReview)
    //

    let env = Risc0Env {};
    let input = env.read(); // Lire l'entrée de l'environnement
    let (_, output) = execute::<RestaurantReview>(&input); // Exécuter la logique du contrat
    env.commit(&output); // Valider la sortie
}