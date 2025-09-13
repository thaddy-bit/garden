import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  const { produit_id, variante_id, entrepot_id, q } = req.query || {};

  let where = '1=1';
  const params = [];
  if (produit_id) { where += ' AND sc.produit_id = ?'; params.push(Number(produit_id)); }
  if (variante_id) { where += ' AND sc.variante_id = ?'; params.push(Number(variante_id)); }
  if (entrepot_id) { where += ' AND sc.entrepot_id = ?'; params.push(Number(entrepot_id)); }

  if (q) {
    where += ' AND (p.nom LIKE ? OR p.sku LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  try {
    const [rows] = await pool.query(
      `SELECT sc.produit_id, sc.variante_id, sc.entrepot_id, sc.quantite_disponible, sc.cout_moyen,
              p.nom AS produit_nom, p.sku AS produit_sku
       FROM stocks_courants sc
       LEFT JOIN produits p ON p.id = sc.produit_id
       WHERE ${where}
       ORDER BY p.nom ASC`,
      params
    );
    res.status(200).json(rows || []);
  } catch (e) {
    console.error('Erreur lecture stocks:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

