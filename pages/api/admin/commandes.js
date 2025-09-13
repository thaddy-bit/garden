import { pool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const connection = await pool.getConnection();

  try {
    const { 
      page = 1, 
      limit = 20, 
      statut = '', 
      search = '', 
      date_debut = '', 
      date_fin = '',
      tri = 'date_commande',
      ordre = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Construction de la requête avec filtres
    let whereConditions = [];
    let queryParams = [];

    // Filtre par statut
    if (statut) {
      whereConditions.push('c.statut = ?');
      queryParams.push(statut);
    }

    // Recherche par numéro de commande ou nom client
    if (search) {
      whereConditions.push('(c.numero_commande LIKE ? OR cl.nom LIKE ? OR cl.prenom LIKE ? OR cl.email LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filtre par date
    if (date_debut) {
      whereConditions.push('DATE(c.date_commande) >= ?');
      queryParams.push(date_debut);
    }
    if (date_fin) {
      whereConditions.push('DATE(c.date_commande) <= ?');
      queryParams.push(date_fin);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Requête principale pour récupérer les commandes avec informations client
    const commandesQuery = `
      SELECT 
        c.*,
        cl.nom as client_nom,
        cl.prenom as client_prenom,
        cl.email as client_email,
        cl.telephone as client_telephone,
        COALESCE(mp.nom, c.methode_paiement, 'Non spécifié') as mode_paiement_nom,
        COALESCE(mp.type, 'especes') as mode_paiement_type,
        COALESCE(mp.icone, '💵') as mode_paiement_icone,
        COUNT(cd.id) as nombre_produits,
        SUM(cd.quantite) as total_quantite
      FROM commandes c
      LEFT JOIN client cl ON c.client_id = cl.id
      LEFT JOIN modes_paiement mp ON c.mode_paiement_id = mp.id
      LEFT JOIN commande_details cd ON c.id = cd.commande_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.${tri} ${ordre}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);

    const [commandes] = await connection.query(commandesQuery, queryParams);

    // Requête pour compter le total des commandes (pour la pagination)
    const countQuery = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM commandes c
      LEFT JOIN client cl ON c.client_id = cl.id
      ${whereClause}
    `;

    const [countResult] = await connection.query(countQuery, queryParams.slice(0, -2));
    const total = countResult[0].total;

    // Récupérer les détails de chaque commande
    const commandesAvecDetails = await Promise.all(
      commandes.map(async (commande) => {
        try {
          // Récupérer les détails des produits
          const [details] = await connection.query(
            `SELECT 
              cd.*,
              p.nom,
              p.slug,
              p.prix as prix_actuel,
              p.prix_reduction,
              p.pourcentage_reduction,
              p.stock,
              pi.image_url,
              m.nom as marque_nom,
              sc.nom as sous_categorie_nom
            FROM commande_details cd
            JOIN produits p ON cd.produit_id = p.id
            LEFT JOIN marques m ON p.marque_id = m.id
            LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
            LEFT JOIN produit_images pi ON p.id = pi.produit_id AND pi.is_principal = 1
            WHERE cd.commande_id = ?`,
            [commande.id]
          );

          // Récupérer les informations de paiement
          const [paiements] = await connection.query(
            `SELECT 
              p.*,
              mp.nom as mode_paiement_nom,
              mp.type as mode_paiement_type,
              mp.icone as mode_paiement_icone
            FROM paiements p
            LEFT JOIN modes_paiement mp ON p.mode_paiement_id = mp.id
            WHERE p.commande_id = ? 
            ORDER BY p.created_at DESC`,
            [commande.id]
          );

          return { 
            ...commande, 
            produits: details,
            paiements: paiements
          };
        } catch (detailError) {
          console.error('Erreur détails commande:', detailError);
          return { 
            ...commande, 
            produits: [],
            paiements: []
          };
        }
      })
    );

    // Statistiques pour le dashboard
    // Créer une clause WHERE adaptée pour les statistiques (sans alias c.)
    let statsWhereClause = '';
    let statsParams = [];
    
    if (whereConditions.length > 0) {
      // Remplacer les références c. par commandes. dans les conditions
      const statsConditions = whereConditions.map(condition => 
        condition.replace(/c\./g, 'commandes.')
      );
      statsWhereClause = `WHERE ${statsConditions.join(' AND ')}`;
      statsParams = queryParams.slice(0, -2);
    }

    const [stats] = await connection.query(`
      SELECT 
        COUNT(*) as total_commandes,
        COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
        COUNT(CASE WHEN statut = 'confirmee' THEN 1 END) as confirmees,
        COUNT(CASE WHEN statut = 'en_preparation' THEN 1 END) as en_preparation,
        COUNT(CASE WHEN statut = 'prete' THEN 1 END) as prete,
        COUNT(CASE WHEN statut = 'en_livraison' THEN 1 END) as en_livraison,
        COUNT(CASE WHEN statut = 'livree' THEN 1 END) as livrees,
        COUNT(CASE WHEN statut = 'annulee' THEN 1 END) as annulees,
        SUM(montant_total) as chiffre_affaires_total,
        AVG(montant_total) as panier_moyen
      FROM commandes
      ${statsWhereClause}
    `, statsParams);

    res.status(200).json({
      commandes: commandesAvecDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      },
      stats: stats[0]
    });
  } catch (error) {
    console.error("Erreur récupération des commandes admin:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des commandes." });
  } finally {
    connection.release();
  }
}
