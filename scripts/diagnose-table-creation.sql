-- Scripts de diagnostic pour identifier le problème

-- 1. Vérifier si la table existe déjà
SHOW TABLES LIKE 'password_reset_tokens';

-- 2. Vérifier les permissions de votre utilisateur
SHOW GRANTS;

-- 3. Vérifier le moteur de stockage par défaut
SHOW VARIABLES LIKE 'default_storage_engine';

-- 4. Lister toutes les tables pour voir les noms exacts
SHOW TABLES;

-- 5. Si la table existe, voir sa structure
-- DESCRIBE password_reset_tokens;

-- 6. Supprimer la table si elle existe (ATTENTION: supprime les données)
-- DROP TABLE IF EXISTS password_reset_tokens;



