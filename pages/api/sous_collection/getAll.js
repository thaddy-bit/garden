import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
  try {
    const [rows] = await pool.query('SELECT id, nom, description, image_url, created_at FROM sous_categories ORDER BY nom ASC');
    return res.status(200).json(rows);
  } catch (e) {
    console.error('getAll sous_categories error', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}


