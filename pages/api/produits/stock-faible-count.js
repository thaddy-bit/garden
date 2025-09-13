import { pool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    // Use stock and stock_minimum per schema
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS count FROM produits WHERE stock IS NOT NULL AND stock_minimum IS NOT NULL AND stock < stock_minimum'
    );
    return res.status(200).json({ count: rows[0].count });
  } catch (error) {
    console.error('Erreur API stock-faible-count:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}