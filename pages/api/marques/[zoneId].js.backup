// pages/api/products/[categoryId].js
// import pool from '../../../lib/db'; // Importe la connexion à la base de données
import { pool } from '@/lib/db';

export default async function handler(req, res) {
  const { zoneId } = req.query; // Récupère l'ID de la zone depuis l'URL

  if (req.method === 'GET') {
    try {
      // Requête SQL pour récupérer les produits de la catégorie spécifiée
      const [rows] = await pool.query(
        'SELECT * FROM catégorie WHERE catégorie.zone = ?',
        [zoneId]
      );
      res.status(200).json(rows); // Renvoie les produits au format JSON
    } catch (error) {
      console.error('Erreur lors de la récupération des produits :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}