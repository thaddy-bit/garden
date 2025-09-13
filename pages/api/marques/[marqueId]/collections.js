import { pool } from '@/lib/db';

export default async function handler(req, res) {
  const { marqueId } = req.query;

  if (req.method === 'GET') {
    try {
      // Récupérer les collections uniques pour cette marque
      const [rows] = await pool.query(
        `SELECT DISTINCT c.id, c.nom, c.description, c.image_url, COUNT(p.id) as produit_count
         FROM collections c
         INNER JOIN produits p ON p.collection_id = c.id
         WHERE p.marque_id = ? AND p.actif = 1 AND c.actif = 1
         GROUP BY c.id, c.nom, c.description, c.image_url
         ORDER BY c.nom ASC`,
        [marqueId]
      );
      
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des collections :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

