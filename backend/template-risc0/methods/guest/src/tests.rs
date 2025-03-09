#[cfg(test)]
mod tests {
    use super::*;
    use risc0_zkvm::guest::env;

    #[test]
    fn test_execute_contract() {
        // Simuler l'entrée de l'environnement
        let input = b"simulated_input";
        env::write(input);

        // Exécuter la fonction principale
        main();

        // Vérifier la sortie
        let output = env::read();
        assert_eq!(output, b"expected_output");
    }
}