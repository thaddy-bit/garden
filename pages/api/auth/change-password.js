import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { motDePasseActuel, nouveauMotDePasse } = req.body;

  // Validation des données
  if (!motDePasseActuel || !nouveauMotDePasse) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  if (nouveauMotDePasse.length < 6) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
  }

  if (motDePasseActuel === nouveauMotDePasse) {
    return res.status(400).json({ error: "Le nouveau mot de passe doit être différent de l'actuel" });
  }

  // Récupérer le token depuis les cookies
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }

  const connection = await pool.getConnection();

  try {

    // Vérifier que l'utilisateur existe et récupérer son mot de passe actuel
    const [users] = await connection.execute(
      "SELECT id, password_hash FROM users WHERE id = ? AND status = 'active'",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = users[0];

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(motDePasseActuel, user.password_hash);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Le mot de passe actuel est incorrect" });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(nouveauMotDePasse, saltRounds);

    // Mettre à jour le mot de passe dans la base de données
    await connection.execute(
      "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
      [hashedNewPassword, userId]
    );

    res.status(200).json({ 
      message: "Mot de passe modifié avec succès",
      success: true 
    });

  } catch (error) {
    console.error("Erreur lors de la modification du mot de passe:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    connection.release();
  }
}
