import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Fonction pour vérifier l'authentification
const verifyAuth = (req) => {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const token = cookies?.token || null;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  const { produitId, quantite } = req.body;
  const client_id = req.query.client_id || req.body.client_id;

  if (!client_id) {
    return res.status(400).json({ error: "Client requis" });
  }

  // Vérifier l'authentification pour toutes les méthodes
  const user = verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Non autorisé - Connexion requise" });
  }

  // Vérifier que l'utilisateur peut accéder à ce panier
  if (user.id != client_id) {
    return res.status(403).json({ error: "Accès refusé - Vous ne pouvez accéder qu'à votre propre panier" });
  }

  if (req.method === 'GET') {
    try {
      const [items] = await pool.query(`
        SELECT 
          p.*, 
          pr.nom, 
          pr.prix, 
          pr.prix_reduction,
          pr.pourcentage_reduction,
          pr.stock,
          pr.slug,
          m.nom as marque_nom,
          sc.nom as sous_categorie_nom,
          pi.image_url
        FROM panier p
        JOIN produits pr ON p.produit_id = pr.id
        LEFT JOIN marques m ON pr.marque_id = m.id
        LEFT JOIN sous_categories sc ON pr.sous_categorie_id = sc.id
        LEFT JOIN produit_images pi ON pr.id = pi.produit_id AND pi.is_principal = 1
        WHERE p.client_id = ?
        ORDER BY p.id DESC
      `, [client_id]);

      return res.status(200).json(items || []);
    } catch (error) {
      console.error('Erreur:', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  if (req.method === 'POST') {
    try {
      const [existing] = await pool.query(
        'SELECT * FROM panier WHERE client_id = ? AND produit_id = ?',
        [client_id, produitId]
      );

      if (existing.length > 0) {
        await pool.query(
          'UPDATE panier SET quantite = quantite + ? WHERE client_id = ? AND produit_id = ?',
          [quantite, client_id, produitId]
        );
      } else {
        await pool.query(
          'INSERT INTO panier (client_id, produit_id, quantite) VALUES (?, ?, ?)',
          [client_id, produitId, quantite]
        );
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { quantite } = req.body;
      if (quantite <= 0) {
        await pool.query(
          'DELETE FROM panier WHERE client_id = ? AND produit_id = ?',
          [client_id, produitId]
        );
      } else {
        await pool.query(
          'UPDATE panier SET quantite = ? WHERE client_id = ? AND produit_id = ?',
          [quantite, client_id, produitId]
        );
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query(
        'DELETE FROM panier WHERE client_id = ? AND produit_id = ?',
        [client_id, produitId]
      );
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
