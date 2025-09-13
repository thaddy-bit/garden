import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date requise (format: YYYY-MM-DD)' });
  }

  try {
    // Sélectionne les agents ayant moins de 2 rendez-vous ce jour-là
    const [rows] = await pool.query(
      `
      SELECT a.id, a.nom, a.métier, a.photo_url
      FROM agents a
      LEFT JOIN (
        SELECT agent_id, COUNT(*) AS total_rdv
        FROM rdv
        WHERE date = ?
        GROUP BY agent_id
      ) r ON a.id = r.agent_id
      WHERE COALESCE(r.total_rdv, 0) < 2
      `
      , [date]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur API agents/disponibles:', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}