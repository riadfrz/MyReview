-- INSTRUCTIONS: 
-- 1. Connectez-vous à votre dashboard Supabase: https://pnrwovvrivhsozczzdpa.supabase.co
-- 2. Allez dans "SQL Editor" dans le menu de gauche
-- 3. Créez un nouveau "New Query"
-- 4. Copiez et collez UNIQUEMENT ce bloc de code (pas le SQL initial du schéma)
-- 5. Cliquez sur "Run" pour exécuter

-- Désactiver complètement RLS pour les tables (solution la plus simple)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- Supprimer la contrainte d'unicité qui bloque les reviews multiples
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_restaurant_id_user_id_key;

-- Vérifier que RLS est désactivé
SELECT 
    tablename,
    CASE 
        WHEN rlspolicy IS NULL THEN 'DISABLED' 
        ELSE 'ENABLED' 
    END AS rls_status
FROM pg_tables 
LEFT JOIN (
    SELECT DISTINCT tablename AS rlspolicy 
    FROM pg_policies
) p 
ON pg_tables.tablename = p.rlspolicy
WHERE schemaname = 'public'; 