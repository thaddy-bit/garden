import { pool } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  try {
    // Récupérer le produit par slug avec toutes les informations
    const [produits] = await pool.execute(`
      SELECT 
        p.*,
        m.nom as marque_nom,
        sc.nom as sous_categorie_nom
      FROM produits p
      LEFT JOIN marques m ON p.marque_id = m.id
      LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
      WHERE p.slug = ?
    `, [slug]);

    if (produits.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const produit = produits[0];

    // Récupérer les images du produit
    const [images] = await pool.execute(`
      SELECT * FROM produit_images 
      WHERE produit_id = ? 
      ORDER BY ordre ASC, is_principal DESC
    `, [produit.id]);

    // Ajouter les images au produit
    produit.images = images;

    res.status(200).json(produit);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}