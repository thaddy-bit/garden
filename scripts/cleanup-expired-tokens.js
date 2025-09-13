import { pool } from '../lib/db';

// Script pour nettoyer les tokens de réinitialisation expirés
// Peut être exécuté via cron job ou appelé périodiquement

export default async function cleanupExpiredTokens() {
  try {
    const result = await pool.query(
      'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL'
    );
    
    console.log(`🧹 Nettoyage terminé: ${result[0].affectedRows} tokens supprimés`);
    return result[0].affectedRows;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des tokens:', error);
    throw error;
  }
}

// Si exécuté directement
if (require.main === module) {
  cleanupExpiredTokens()
    .then((count) => {
      console.log(`✅ ${count} tokens nettoyés avec succès`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}



