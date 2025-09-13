import { pool } from '../../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  try {
    // Récupérer le produit par slug
    const [produits] = await pool.execute(`
      SELECT id FROM produits WHERE slug = ?
    `, [slug]);

    if (produits.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const produitId = produits[0].id;

    // Récupérer toutes les variantes du produit avec leurs attributs
    const [variantes] = await pool.execute(`
      SELECT 
        pv.id,
        pv.sku,
        pv.prix,
        pv.prix_reduction,
        pv.stock,
        pv.poids,
        pv.image_url,
        pv.actif
      FROM produit_variantes pv
      WHERE pv.produit_id = ? AND pv.actif = 1
      ORDER BY pv.id
    `, [produitId]);

    // Pour chaque variante, récupérer ses attributs
    const variantesWithAttributs = await Promise.all(
      variantes.map(async (variante) => {
        const [attributs] = await pool.execute(`
          SELECT 
            a.id,
            a.nom,
            a.type,
            a.valeur,
            a.code_couleur,
            a.ordre
          FROM variante_attributs va
          JOIN attributs a ON va.attribut_id = a.id
          WHERE va.variante_id = ?
          ORDER BY a.type, a.ordre
        `, [variante.id]);

        return {
          ...variante,
          attributs
        };
      })
    );

    res.status(200).json(variantesWithAttributs);
  } catch (error) {
    console.error('Erreur lors de la récupération des variantes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

