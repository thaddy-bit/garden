-- Script pour créer la table password_reset_tokens
-- À exécuter dans votre base de données MySQL

-- Version sans clé étrangère (pour éviter l'erreur errno: 150)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  requested_ip VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_token_hash (token_hash),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Ajouter la clé étrangère après création de la table (si nécessaire)
-- ALTER TABLE password_reset_tokens 
-- ADD CONSTRAINT fk_password_reset_user 
-- FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Nettoyer les tokens expirés (optionnel - peut être fait via cron job)
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW();
