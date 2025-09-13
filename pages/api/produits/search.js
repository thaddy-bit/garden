import { pool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({ produits: [] });
  }

  const connection = await pool.getConnection();

  try {
    const searchTerm = `%${q}%`;
    
    const query = `
      SELECT 
        p.id,
        p.nom,
        p.prix,
        p.stock,
        pi.image_url,
        m.nom as marque_nom
      FROM produits p
      LEFT JOIN marques m ON p.marque_id = m.id
      LEFT JOIN produit_images pi ON p.id = pi.produit_id AND pi.is_principal = 1
      WHERE 
        p.nom LIKE ? 
        OR p.sku LIKE ?
        OR m.nom LIKE ?
        OR p.description LIKE ?
        AND p.actif = 1
      ORDER BY p.nom ASC
      LIMIT 20
    `;

    const [rows] = await connection.execute(query, [searchTerm, searchTerm, searchTerm, searchTerm]);

    res.status(200).json({ 
      produits: rows.map(row => ({
        id: row.id,
        nom: row.nom,
        prix: row.prix,
        stock_disponible: row.stock || 0,
        image_url: row.image_url,
        marque_nom: row.marque_nom || 'Sans marque'
      }))
    });

  } catch (error) {
    console.error("Erreur lors de la recherche de produits:", error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  } finally {
    connection.release();
  }
}
