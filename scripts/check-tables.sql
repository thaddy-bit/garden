-- Script pour vérifier les tables existantes
SHOW TABLES;

-- Vérifier si la table clients existe
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'u729893412_garden' 
AND TABLE_NAME = 'clients';

-- Vérifier si la table password_reset_tokens existe
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'u729893412_garden' 
AND TABLE_NAME = 'password_reset_tokens';









