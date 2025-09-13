-- Script ultra-simple pour créer la table password_reset_tokens
-- Version minimale sans aucun index ni contrainte

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  requested_ip VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Si ça marche, on ajoute les index après :
-- CREATE INDEX idx_token_hash ON password_reset_tokens (token_hash);
-- CREATE INDEX idx_user_id ON password_reset_tokens (user_id);
-- CREATE INDEX idx_expires_at ON password_reset_tokens (expires_at);
