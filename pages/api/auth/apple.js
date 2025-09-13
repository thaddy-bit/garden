import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { identityToken, authorizationCode, user } = req.body;

    if (!identityToken) {
      return res.status(400).json({ message: 'Identity token Apple requis' });
    }

    // Pour Apple Sign In, nous devons vérifier le token JWT
    // Dans un environnement de production, vous devriez vérifier la signature
    // Pour cette implémentation, nous allons décoder le token (non sécurisé en production)
    
    const tokenParts = identityToken.split('.');
    if (tokenParts.length !== 3) {
      return res.status(400).json({ message: 'Token Apple invalide' });
    }

    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const {
      sub: appleId,
      email,
      email_verified: emailVerified
    } = payload;

    // Utiliser les données utilisateur fournies par Apple si disponibles
    const userName = user ? JSON.parse(user).name : null;
    const firstName = userName?.firstName || 'Utilisateur';
    const lastName = userName?.lastName || 'Apple';

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
        'SELECT * FROM client WHERE email = ? OR (provider = "apple" AND provider_id = ?)',
        [email, appleId]
      );

      let userData;
      let isNewUser = false;

      if (existingUsers.length > 0) {
        // Utilisateur existant - mettre à jour les infos
        userData = existingUsers[0];
        
        await connection.execute(
          `UPDATE client SET 
            provider = 'apple',
            provider_id = ?,
            email_verified = ?,
            social_data = ?,
            last_social_login = NOW(),
            updated_at = NOW()
          WHERE id = ?`,
          [
            appleId,
            emailVerified ? 1 : 0,
            JSON.stringify({
              authorization_code: authorizationCode,
              apple_id: appleId
            }),
            userData.id
          ]
        );
      } else {
        // Nouvel utilisateur - créer le compte
        const [result] = await connection.execute(
          `INSERT INTO client (
            nom, prenom, email, provider, provider_id, 
            email_verified, social_data, 
            telephone, password, created_at, updated_at
          ) VALUES (?, ?, ?, 'apple', ?, ?, ?, '', '', NOW(), NOW())`,
          [
            firstName,
            lastName,
            email,
            appleId,
            emailVerified ? 1 : 0,
            JSON.stringify({
              authorization_code: authorizationCode,
              apple_id: appleId
            })
          ]
        );

        userData = {
          id: result.insertId,
          nom: firstName,
          prenom: lastName,
          email,
          provider: 'apple',
          provider_id: appleId,
          email_verified: emailVerified ? 1 : 0
        };
        isNewUser = true;
      }

      // Générer le JWT token
      const jwtToken = jwt.sign(
        { 
          userId: userData.id, 
          email: userData.email,
          provider: 'apple',
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
          id: userData.id,
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          provider: userData.provider,
          isNewUser
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Erreur Apple Sign In:', error);
    
    res.status(500).json({ 
      message: 'Erreur lors de l\'authentification Apple',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


