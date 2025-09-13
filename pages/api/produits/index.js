import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });
  const { q = '', marqueId, sousCatId, sort = 'recent', page = '1', limit = '20' } = req.query;
  const lim = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const offset = (Math.max(1, parseInt(page, 10) || 1) - 1) * lim;

  const where = [];
  const params = [];
  if (q) {
    where.push('(p.nom LIKE ? OR p.sku LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  if (marqueId) { where.push('p.marque_id = ?'); params.push(marqueId); }
  if (sousCatId) { where.push('p.sous_categorie_id = ?'); params.push(sousCatId); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  let orderBy = 'p.created_at DESC';
  if (sort === 'name_asc') orderBy = 'p.nom ASC';
  if (sort === 'name_desc') orderBy = 'p.nom DESC';
  if (sort === 'price_asc') orderBy = 'p.prix ASC';
  if (sort === 'price_desc') orderBy = 'p.prix DESC';

  try {
    const [rows] = await pool.query(
      `SELECT 
         p.id, p.nom, p.slug, p.prix, p.stock, p.stock_minimum,
         m.nom AS marque_nom,
         sc.nom AS sous_categorie_nom,
         (
           SELECT pi.image_url FROM produit_images pi
           WHERE pi.produit_id = p.id
           ORDER BY pi.is_principal DESC, pi.ordre ASC LIMIT 1
         ) AS image_url
       FROM produits p
       LEFT JOIN marques m ON p.marque_id = m.id
       LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT ${lim} OFFSET ${offset}`,
      params
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM produits p ${whereSql}`,
      params
    );

    return res.status(200).json({ items: rows, total, page: parseInt(page, 10) || 1, limit: lim });
  } catch (e) {
    console.error('list produits error', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}


