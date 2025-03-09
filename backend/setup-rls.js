#!/usr/bin/env node
const axios = require('axios');
require('dotenv').config();

// Configuration Supabase
const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://pnrwovvrivhsozczzdpa.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

// Headers pour l'API REST Supabase
const headers = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  Prefer: 'return=minimal',
};

// Fonction pour vérifier si une table existe
async function checkTable(tableName) {
  try {
    console.log(`Vérification de la table ${tableName}...`);

    const response = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/${tableName}?limit=1`,
      headers,
    });

    console.log(`✅ Table ${tableName} accessible`);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`❌ Table ${tableName} n'existe pas`);
      return false;
    }

    if (error.response && error.response.status === 401) {
      console.log(
        `❌ Accès refusé à la table ${tableName}. Problème d'authentification.`
      );
    } else if (error.response && error.response.status === 403) {
      console.log(
        `❌ Accès refusé à la table ${tableName}. Problème de permission RLS.`
      );
    } else {
      console.log(
        `❌ Erreur en accédant à la table ${tableName}:`,
        error.message
      );
    }

    return false;
  }
}

// Fonction pour créer une politique qui permet toutes les opérations
async function createOpenPolicy(tableName) {
  try {
    console.log(
      `Tentative de création d'une politique ouverte pour la table ${tableName}...`
    );

    // Le SQL pour créer/remplacer une politique ouverte
    const sql = `
      BEGIN;
      -- Activer RLS sur la table si ce n'est pas déjà fait
      ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;
      
      -- Supprimer la politique existante si elle existe
      DROP POLICY IF EXISTS "Allow hackathon open access" ON public.${tableName};
      
      -- Créer une nouvelle politique qui permet toutes les opérations
      CREATE POLICY "Allow hackathon open access" 
      ON public.${tableName} 
      FOR ALL 
      TO anon, authenticated
      USING (true) 
      WITH CHECK (true);
      
      COMMIT;
    `;

    // Exécuter le SQL via l'API REST
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      headers,
      data: { query: sql },
    });

    console.log(`✅ Politique ouverte créée pour la table ${tableName}`);
    return true;
  } catch (error) {
    console.log(
      `❌ Erreur lors de la création de la politique pour ${tableName}:`,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

// Fonction principale
async function setupRLS() {
  console.log(
    '\n===== CONFIGURATION DES POLITIQUES RLS POUR LE HACKATHON =====\n'
  );

  // Liste des tables à configurer
  const tables = ['users', 'restaurants', 'reviews'];

  // Vérifier l'accès aux tables
  console.log("\n--- Vérification de l'accès aux tables ---\n");
  for (const table of tables) {
    await checkTable(table);
  }

  // Créer des politiques ouvertes
  console.log('\n--- Création des politiques ouvertes ---\n');
  for (const table of tables) {
    await createOpenPolicy(table);
  }

  // Vérifier à nouveau l'accès
  console.log("\n--- Vérification de l'accès après configuration ---\n");
  for (const table of tables) {
    await checkTable(table);
  }

  console.log('\n===== CONFIGURATION TERMINÉE =====\n');
  console.log("Pour tester l'insertion, exécutez: npm run direct");
}

// Exécuter le script
setupRLS();
