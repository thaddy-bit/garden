-- Script pour insérer un utilisateur de test
-- Mot de passe: "password123" (hashé avec bcrypt)

INSERT INTO clients (nom, prenom, email, mot_de_passe, actif) 
VALUES (
  'Test', 
  'User', 
  'bonheurthaddy0@gmail.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  1
) 
ON DUPLICATE KEY UPDATE 
  mot_de_passe = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  actif = 1;








