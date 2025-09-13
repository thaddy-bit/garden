import { pool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { seuil = 3 } = req.query;

  const connection = await pool.getConnection();

  try {
    const query = `
      SELECT 
        p.id,
        p.nom,
        p.prix,
        p.stock,
        p.stock_minimum,
        p.sku,
        pi.image_url,
        m.nom as marque_nom,
        sc.nom as sous_categorie_nom
      FROM produits p
      LEFT JOIN marques m ON p.marque_id = m.id
      LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
      LEFT JOIN produit_images pi ON p.id = pi.produit_id AND pi.is_principal = 1
      WHERE p.stock < ? AND p.actif = 1
      ORDER BY p.stock ASC, p.nom ASC
    `;

    const [rows] = await connection.execute(query, [parseInt(seuil)]);

    res.status(200).json({ 
      produits: rows.map(row => ({
        id: row.id,
        nom: row.nom,
        prix: row.prix,
        stock: row.stock,
        stock_minimum: row.stock_minimum,
        sku: row.sku,
        image_url: row.image_url,
        marque_nom: row.marque_nom || 'Sans marque',
        sous_categorie_nom: row.sous_categorie_nom || 'Sans catégorie'
      })),
      seuil: parseInt(seuil),
      total: rows.length
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du stock faible:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  } finally {
    connection.release();
  }
}