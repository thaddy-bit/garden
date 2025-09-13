import { pool } from '../../../lib/db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { token, newPassword, confirmPassword } = req.body;

  // Validation des données
  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
  }

  // Validation du mot de passe
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return res.status(400).json({ 
      message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre' 
    });
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
        message: 'Token invalide ou expiré. Veuillez demander un nouveau lien.' 
      });
    }

    const resetToken = tokens[0];

    // Hasher le nouveau mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Démarrer une transaction
    await pool.query('START TRANSACTION');

    try {
      // Mettre à jour le mot de passe
      await pool.query(
        'UPDATE client SET password = ?, updated_at = NOW() WHERE id = ?',
        [hashedPassword, resetToken.user_id]
      );

      // Marquer le token comme utilisé
      await pool.query(
        'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?',
        [resetToken.id]
      );

      await pool.query('COMMIT');

      console.log(`Mot de passe réinitialisé avec succès pour: ${resetToken.email}`);

      return res.status(200).json({ 
        message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' 
      });

    } catch (transactionError) {
      await pool.query('ROLLBACK');
      throw transactionError;
    }

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    return res.status(500).json({ 
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
    });
  }
}
