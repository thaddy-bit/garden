-- Script de diagnostic pour les clés étrangères
-- Exécutez ces commandes pour diagnostiquer le problème

-- 1. Vérifier la structure de la table clients
DESCRIBE clients;

-- 2. Vérifier le moteur de stockage
SHOW TABLE STATUS LIKE 'clients';

-- 3. Vérifier les contraintes existantes
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'clients';

-- 4. Vérifier les index sur la colonne id de clients
SHOW INDEX FROM clients WHERE Column_name = 'id';

-- 5. Si la table clients n'existe pas ou a un nom différent, lister toutes les tables
SHOW TABLES;



