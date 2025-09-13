import { pool } from '@/lib/db';

export default async function handler(req, res) {
  const { marqueId } = req.query;

  if (req.method === 'GET') {
    try {
      // Récupérer tous les produits d'une marque (toutes sous-catégories confondues)
              const [rows] = await pool.query(
          `SELECT p.*, m.nom as marque_nom, sc.nom as sous_categorie_nom
           FROM produits p
           LEFT JOIN marques m ON p.marque_id = m.id
           LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
           WHERE p.marque_id = ?
           ORDER BY p.created_at DESC`,
          [marqueId]
        );

        // Récupérer les images pour chaque produit
        for (let produit of rows) {
          const [images] = await pool.query(
            `SELECT * FROM produit_images 
             WHERE produit_id = ? 
             ORDER BY ordre ASC, is_principal DESC`,
            [produit.id]
          );
          produit.images = images;
        }
      
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits de la marque :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
