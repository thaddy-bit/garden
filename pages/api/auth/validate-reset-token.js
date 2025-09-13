import { pool } from '../../../lib/db';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token requis' });
  }

  try {
    // Hasher le token pour la recherche
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Vérifier le token
    const [tokens] = await pool.query(
      `SELECT prt.*, c.email, c.nom, c.prenom 
       FROM password_reset_tokens prt
       JOIN client c ON prt.user_id = c.id
       WHERE prt.token_hash = ? 
       AND prt.expires_at > NOW() 
       AND prt.used_at IS NULL`,
      [tokenHash]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ 
        message: 'Token invalide ou expiré' 
      });
    }

    // Token valide
    return res.status(200).json({ 
      message: 'Token valide',
      user: {
        email: tokens[0].email,
        nom: tokens[0].nom,
        prenom: tokens[0].prenom
      }
    });

  } catch (error) {
    console.error('Erreur lors de la validation du token:', error);
    return res.status(500).json({ 
      message: 'Une erreur est survenue' 
    });
  }
}
