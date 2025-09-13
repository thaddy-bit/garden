import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
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
    // Récupérer les informations de l'utilisateur
    const [users] = await connection.execute(
      `SELECT 
        id, 
        nom, 
        prenom, 
        email, 
        telephone, 
        adresse, 
        role, 
        status,
        created_at,
        last_login_at
      FROM users 
      WHERE id = ? AND status = 'active'`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = users[0];

    res.status(200).json({ 
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        adresse: user.adresse,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        last_login_at: user.last_login_at
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    connection.release();
  }
}


