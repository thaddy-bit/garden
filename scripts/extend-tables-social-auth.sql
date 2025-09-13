-- Script pour étendre les tables users et client pour l'authentification sociale
-- Compatible avec Google, Apple, Facebook, Twitter, LinkedIn, Microsoft

-- Extension de la table users (administrateurs)
ALTER TABLE `users` 
ADD COLUMN `provider` ENUM('local', 'google', 'apple', 'facebook', 'twitter', 'linkedin', 'microsoft') DEFAULT 'local' AFTER `email`,
ADD COLUMN `provider_id` VARCHAR(255) NULL AFTER `provider`,
ADD COLUMN `avatar_url` VARCHAR(500) NULL AFTER `provider_id`,
ADD COLUMN `email_verified` TINYINT(1) DEFAULT 0 AFTER `avatar_url`,
ADD COLUMN `social_data` JSON NULL AFTER `email_verified`,
ADD COLUMN `last_social_login` DATETIME NULL AFTER `social_data`;

-- Extension de la table client (clients du site)
ALTER TABLE `client` 
ADD COLUMN `provider` ENUM('local', 'google', 'apple', 'facebook', 'twitter', 'linkedin', 'microsoft') DEFAULT 'local' AFTER `email`,
ADD COLUMN `provider_id` VARCHAR(255) NULL AFTER `provider`,
ADD COLUMN `avatar_url` VARCHAR(500) NULL AFTER `provider_id`,
ADD COLUMN `email_verified` TINYINT(1) DEFAULT 0 AFTER `avatar_url`,
ADD COLUMN `social_data` JSON NULL AFTER `email_verified`,
ADD COLUMN `last_social_login` DATETIME NULL AFTER `social_data`;

-- Ajout d'index pour optimiser les requêtes
ALTER TABLE `users` 
ADD INDEX `idx_users_provider` (`provider`),
ADD INDEX `idx_users_provider_id` (`provider_id`),
ADD UNIQUE KEY `uk_users_provider_email` (`provider`, `email`);

ALTER TABLE `client` 
ADD INDEX `idx_client_provider` (`provider`),
ADD INDEX `idx_client_provider_id` (`provider_id`),
ADD UNIQUE KEY `uk_client_provider_email` (`provider`, `email`);

-- Commentaires pour documentation
ALTER TABLE `users` 
MODIFY COLUMN `provider` ENUM('local', 'google', 'apple', 'facebook', 'twitter', 'linkedin', 'microsoft') DEFAULT 'local' COMMENT 'Provider d\'authentification',
MODIFY COLUMN `provider_id` VARCHAR(255) NULL COMMENT 'ID unique du provider social',
MODIFY COLUMN `avatar_url` VARCHAR(500) NULL COMMENT 'URL de l\'avatar du provider social',
MODIFY COLUMN `email_verified` TINYINT(1) DEFAULT 0 COMMENT 'Email vérifié par le provider social',
MODIFY COLUMN `social_data` JSON NULL COMMENT 'Données supplémentaires du provider social',
MODIFY COLUMN `last_social_login` DATETIME NULL COMMENT 'Dernière connexion via provider social';

ALTER TABLE `client` 
MODIFY COLUMN `provider` ENUM('local', 'google', 'apple', 'facebook', 'twitter', 'linkedin', 'microsoft') DEFAULT 'local' COMMENT 'Provider d\'authentification',
MODIFY COLUMN `provider_id` VARCHAR(255) NULL COMMENT 'ID unique du provider social',
MODIFY COLUMN `avatar_url` VARCHAR(500) NULL COMMENT 'URL de l\'avatar du provider social',
MODIFY COLUMN `email_verified` TINYINT(1) DEFAULT 0 COMMENT 'Email vérifié par le provider social',
MODIFY COLUMN `social_data` JSON NULL COMMENT 'Données supplémentaires du provider social',
MODIFY COLUMN `last_social_login` DATETIME NULL COMMENT 'Dernière connexion via provider social';


