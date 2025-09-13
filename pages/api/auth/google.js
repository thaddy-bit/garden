import { OAuth2Client } from 'google-auth-library';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token Google requis' });
    }

    // Vérifier le token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      name,
      picture: avatarUrl,
      email_verified: emailVerified
    } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email non fourni par Google' });
    }

    // Connexion à la base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    try {
      // Chercher l'utilisateur existant
      const [existingUsers] = await connection.execute(
        'SELECT * FROM client WHERE email = ? OR (provider = "google" AND provider_id = ?)',
        [email, googleId]
      );

      let user;
      let isNewUser = false;

      if (existingUsers.length > 0) {
        // Utilisateur existant - mettre à jour les infos
        user = existingUsers[0];
        
        await connection.execute(
          `UPDATE client SET 
            provider = 'google',
            provider_id = ?,
            avatar_url = ?,
            email_verified = ?,
            social_data = ?,
            last_social_login = NOW(),
            updated_at = NOW()
          WHERE id = ?`,
          [
            googleId,
            avatarUrl,
            emailVerified ? 1 : 0,
            JSON.stringify({
              name,
              locale: payload.locale,
              family_name: payload.family_name,
              given_name: payload.given_name
            }),
            user.id
          ]
        );
      } else {
        // Nouvel utilisateur - créer le compte
        const [result] = await connection.execute(
          `INSERT INTO client (
            nom, prenom, email, provider, provider_id, 
            avatar_url, email_verified, social_data, 
            telephone, password, created_at, updated_at
          ) VALUES (?, ?, ?, 'google', ?, ?, ?, ?, '', '', NOW(), NOW())`,
          [
            name?.split(' ')[0] || 'Utilisateur',
            name?.split(' ').slice(1).join(' ') || 'Google',
            email,
            googleId,
            avatarUrl,
            emailVerified ? 1 : 0,
            JSON.stringify({
              name,
              locale: payload.locale,
              family_name: payload.family_name,
              given_name: payload.given_name
            })
          ]
        );

        user = {
          id: result.insertId,
          nom: name?.split(' ')[0] || 'Utilisateur',
          prenom: name?.split(' ').slice(1).join(' ') || 'Google',
          email,
          provider: 'google',
          provider_id: googleId,
          avatar_url: avatarUrl,
          email_verified: emailVerified ? 1 : 0
        };
        isNewUser = true;
      }

      // Générer le JWT token
      const jwtToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          provider: 'google',
          isNewUser 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Définir le cookie
      const tokenCookie = cookie.serialize('client_token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 jours
        path: '/'
      });

      res.setHeader('Set-Cookie', tokenCookie);

      res.status(200).json({
        success: true,
        message: isNewUser ? 'Compte créé avec succès' : 'Connexion réussie',
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          avatar_url: user.avatar_url,
          provider: user.provider,
          isNewUser
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Erreur Google OAuth:', error);
    
    if (error.message.includes('Token expired')) {
      return res.status(401).json({ message: 'Token Google expiré' });
    }
    
    if (error.message.includes('Invalid token')) {
      return res.status(401).json({ message: 'Token Google invalide' });
    }

    res.status(500).json({ 
      message: 'Erreur lors de l\'authentification Google',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


