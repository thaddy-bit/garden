import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token Facebook requis' });
    }

    // Vérifier le token Facebook
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!response.ok) {
      return res.status(401).json({ message: 'Token Facebook invalide' });
    }

    const facebookData = await response.json();
    const {
      id: facebookId,
      email,
      name,
      picture
    } = facebookData;

    if (!email) {
      return res.status(400).json({ message: 'Email non fourni par Facebook' });
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
        'SELECT * FROM client WHERE email = ? OR (provider = "facebook" AND provider_id = ?)',
        [email, facebookId]
      );

      let user;
      let isNewUser = false;

      if (existingUsers.length > 0) {
        // Utilisateur existant - mettre à jour les infos
        user = existingUsers[0];
        
        await connection.execute(
          `UPDATE client SET 
            provider = 'facebook',
            provider_id = ?,
            avatar_url = ?,
            email_verified = 1,
            social_data = ?,
            last_social_login = NOW(),
            updated_at = NOW()
          WHERE id = ?`,
          [
            facebookId,
            picture?.data?.url || null,
            JSON.stringify({
              name,
              facebook_id: facebookId
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
          ) VALUES (?, ?, ?, 'facebook', ?, ?, 1, ?, '', '', NOW(), NOW())`,
          [
            name?.split(' ')[0] || 'Utilisateur',
            name?.split(' ').slice(1).join(' ') || 'Facebook',
            email,
            facebookId,
            picture?.data?.url || null,
            JSON.stringify({
              name,
              facebook_id: facebookId
            })
          ]
        );

        user = {
          id: result.insertId,
          nom: name?.split(' ')[0] || 'Utilisateur',
          prenom: name?.split(' ').slice(1).join(' ') || 'Facebook',
          email,
          provider: 'facebook',
          provider_id: facebookId,
          avatar_url: picture?.data?.url || null,
          email_verified: 1
        };
        isNewUser = true;
      }

      // Générer le JWT token
      const jwtToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          provider: 'facebook',
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
    console.error('Erreur Facebook OAuth:', error);
    
    res.status(500).json({ 
      message: 'Erreur lors de l\'authentification Facebook',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


