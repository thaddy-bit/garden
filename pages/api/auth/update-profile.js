import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { nom, prenom, email, telephone, adresse } = req.body;

  // Validation des données
  if (!nom || !prenom || !email || !telephone || !adresse) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  // Validation de l'email
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "L'email n'est pas valide" });
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
    // Vérifier que l'utilisateur existe
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE id = ? AND status = 'active'",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const [existingEmail] = await connection.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "Cet email est déjà utilisé par un autre utilisateur" });
    }

    // Mettre à jour le profil
    await connection.execute(
      `UPDATE users SET 
        nom = ?, 
        prenom = ?, 
        email = ?, 
        telephone = ?, 
        adresse = ?, 
        updated_at = NOW() 
      WHERE id = ?`,
      [nom, prenom, email, telephone, adresse, userId]
    );

    res.status(200).json({ 
      message: "Profil mis à jour avec succès",
      success: true 
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    connection.release();
  }
}



