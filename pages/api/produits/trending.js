import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Récupérer les produits tendance (en_vedette = 1) avec leurs informations complètes
    const [produits] = await pool.query(`
      SELECT 
        p.*,
        m.nom as marque_nom,
        sc.nom as sous_categorie_nom,
        c.nom as collection_nom
      FROM produits p
      LEFT JOIN marques m ON p.marque_id = m.id
      LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.en_vedette = 1 
        AND p.actif = 1
        AND p.stock > 0
      ORDER BY p.created_at DESC
      LIMIT 12
    `);

    // Récupérer les images pour chaque produit
    for (let produit of produits) {
      const [images] = await pool.query(`
        SELECT * FROM produit_images 
        WHERE produit_id = ? 
        ORDER BY ordre ASC, is_principal DESC
      `, [produit.id]);
      
      produit.images = images;
      
      // Ajouter l'image principale pour le slider
      if (images.length > 0) {
        produit.image = images[0].url;
      } else {
        produit.image = '/images/products/default-product.jpg';
      }
    }

    res.status(200).json(produits);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits tendance:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
