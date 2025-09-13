import { pool } from '@/lib/db';

export default async function handler(req, res) {
  const { marqueId } = req.query;

  if (req.method === 'GET') {
    try {
      // Récupérer les sous-catégories uniques pour cette marque
      const [rows] = await pool.query(
        `SELECT DISTINCT sc.id, sc.nom, sc.description, sc.image_url, COUNT(p.id) as produit_count
         FROM sous_categories sc
         INNER JOIN produits p ON p.sous_categorie_id = sc.id
         WHERE p.marque_id = ? AND p.actif = 1
         GROUP BY sc.id, sc.nom, sc.description, sc.image_url
         ORDER BY sc.nom ASC`,
        [marqueId]
      );
      
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des sous-catégories :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

