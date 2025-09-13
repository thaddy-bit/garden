import { pool } from '../../../lib/db';
import crypto from 'crypto';

// Import conditionnel de Resend
let Resend;
try {
  Resend = require('resend').Resend;
} catch (error) {
  console.log('Resend non disponible - mode développement');
}

// Rate limiting simple (en production, utiliser Redis ou une solution plus robuste)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 heure
const MAX_REQUESTS_PER_HOUR = 3;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Nettoyer les anciennes requêtes
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email } = req.body;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Validation basique
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  // Rate limiting
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      message: 'Trop de demandes. Veuillez réessayer dans une heure.' 
    });
  }

  try {
    // Vérifier si l'utilisateur existe (sans révéler l'existence)
    const [users] = await pool.query(
      'SELECT id, nom, prenom FROM client WHERE email = ?',
      [email]
    );

    // Toujours retourner le même message pour éviter l'énumération d'emails
    const responseMessage = 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.';

    if (users.length === 0) {
      // Log pour audit (sans révéler à l'utilisateur)
      console.log(`Tentative de reset pour email inexistant: ${email} depuis IP: ${clientIP}`);
      return res.status(200).json({ message: responseMessage });
    }

    const user = users[0];

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Expiration dans 30 minutes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Invalider tous les tokens précédents pour cet utilisateur
    await pool.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL',
      [user.id]
    );

    // Stocker le nouveau token
    await pool.query(
      `INSERT INTO password_reset_tokens 
       (user_id, token_hash, expires_at, requested_ip, user_agent) 
       VALUES (?, ?, ?, ?, ?)`,
      [user.id, tokenHash, expiresAt, clientIP, req.headers['user-agent']]
    );

    // Envoyer l'email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    // Vérifier si Resend est configuré pour envoyer de vrais emails
    if (process.env.RESEND_API_KEY && 
        process.env.RESEND_API_KEY !== 're_test_key_for_development' && 
        process.env.RESEND_API_KEY !== 're_your_actual_resend_api_key_here' &&
        process.env.RESEND_API_KEY.startsWith('re_')) {
      
      // Mode production : envoyer l'email réel
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Garden <onboarding@resend.dev>',
          to: [email],
          subject: 'Réinitialisation de votre mot de passe - Garden',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #16a34a; margin: 0;">Garden</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #111827; margin-top: 0;">Réinitialisation de mot de passe</h2>
                
                <p style="color: #374151; line-height: 1.6;">
                  Bonjour ${user.prenom || user.nom},
                </p>
                
                <p style="color: #374151; line-height: 1.6;">
                  Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                    Réinitialiser mon mot de passe
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                  Ce lien est valide pendant 30 minutes et ne peut être utilisé qu'une seule fois.
                </p>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                  Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
              </div>
              
              <div style="text-align: center; color: #6b7280; font-size: 12px;">
                <p>© 2024 Garden. Tous droits réservés.</p>
              </div>
            </div>
          `
        });

        console.log(`✅ Email de reset envoyé avec succès à: ${email}`);
      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError);
        // Continuer même si l'email échoue
      }
    } else {
      // Mode développement : afficher le lien dans les logs
      console.log('🔗 MODE DÉVELOPPEMENT - Lien de réinitialisation:');
      console.log(resetUrl);
      console.log(`📧 Email simulé envoyé à: ${email}`);
    }

    return res.status(200).json({ message: responseMessage });

  } catch (error) {
    console.error('Erreur lors de la demande de reset:', error);
    return res.status(500).json({ 
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.' 
    });
  }
}
