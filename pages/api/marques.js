// pages/api/marques.js
import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Récupérer seulement les champs nécessaires pour améliorer les performances
      const [rows] = await pool.query(`
        SELECT id, nom, description, image_url, zone, created_at 
        FROM marques 
        ORDER BY nom ASC
      `);
      
      // Cache pour 5 minutes
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des marques :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
} 