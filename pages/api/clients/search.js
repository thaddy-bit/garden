import { pool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({ clients: [] });
  }

  const connection = await pool.getConnection();

  try {
    const searchTerm = `%${q}%`;
    
    const query = `
      SELECT 
        id,
        nom,
        prenom,
        email,
        telephone
      FROM client
      WHERE 
        nom LIKE ? 
        OR prenom LIKE ?
        OR email LIKE ?
        OR telephone LIKE ?
      ORDER BY nom ASC, prenom ASC
      LIMIT 10
    `;

    const [rows] = await connection.execute(query, [searchTerm, searchTerm, searchTerm, searchTerm]);

    res.status(200).json({ 
      clients: rows.map(row => ({
        id: row.id,
        nom: row.nom,
        prenom: row.prenom,
        email: row.email,
        telephone: row.telephone
      }))
    });

  } catch (error) {
    console.error("Erreur lors de la recherche de clients:", error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  } finally {
    connection.release();
  }
}
