// pages/api/dashboard/stats.js
import { pool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const conn = await pool.getConnection();
    const period = (req.query.period || 'month').toString(); // 'day' | 'week' | 'month'

    // Helpers
    const periodCondition = {
      day: `DATE(date_commande) = CURDATE()`,
      week: `YEARWEEK(date_commande, 1) = YEARWEEK(CURDATE(), 1)`,
      month: `YEAR(date_commande) = YEAR(CURDATE()) AND MONTH(date_commande) = MONTH(CURDATE())`,
    }[period] || `YEAR(date_commande) = YEAR(CURDATE()) AND MONTH(date_commande) = MONTH(CURDATE())`;

    // Total commandes
    const [commandes] = await conn.query('SELECT COUNT(*) AS total FROM commandes');

    // Total produits
    const [produits] = await conn.query('SELECT COUNT(*) AS total FROM produits');

    // Chiffre d'affaires du jour (hors annulee/refusee)
    const [caJourRows] = await conn.query(
      `SELECT COALESCE(SUM(montant_total),0) AS total
       FROM commandes
       WHERE DATE(date_commande) = CURDATE()
         AND statut NOT IN ('annulee','refusee')`
    );

    // Chiffre d'affaires cumulé du mois (hors annulee/refusee)
    const [caMoisRows] = await conn.query(
      `SELECT COALESCE(SUM(montant_total),0) AS total
       FROM commandes
       WHERE YEAR(date_commande) = YEAR(CURDATE())
         AND MONTH(date_commande) = MONTH(CURDATE())
         AND statut NOT IN ('annulee','refusee')`
    );

    // Commandes du jour (hors annulee/refusee)
    const [cmdJourRows] = await conn.query(
      `SELECT COUNT(*) AS total
       FROM commandes
       WHERE DATE(date_commande) = CURDATE()
         AND statut NOT IN ('annulee','refusee')`
    );

    // Panier moyen du jour (hors annulee/refusee)
    const [avgJourRows] = await conn.query(
      `SELECT COALESCE(AVG(montant_total),0) AS avg_total
       FROM commandes
       WHERE DATE(date_commande) = CURDATE()
         AND statut NOT IN ('annulee','refusee')`
    );

    // Répartition des produits par sous-catégorie (schema uses sous_categorie_id)
    const [categories] = await conn.query(`
      SELECT sc.nom AS name, COUNT(p.id) AS value
      FROM produits p
      JOIN sous_categories sc ON p.sous_categorie_id = sc.id
      GROUP BY p.sous_categorie_id
    `);

    // Ventes par mois (12 derniers mois) hors annulee/refusee
    const [ventesParMois] = await conn.query(`
      SELECT DATE_FORMAT(date_commande, '%b') AS mois, SUM(montant_total) AS ventes
      FROM commandes
      WHERE date_commande >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        AND statut NOT IN ('annulee','refusee')
      GROUP BY YEAR(date_commande), MONTH(date_commande)
      ORDER BY YEAR(date_commande), MONTH(date_commande)
    `);

    // Ventes sur 30 jours (série quotidienne) hors annulee/refusee
    const windowCond = period === 'day' 
      ? `DATE(date_commande) = CURDATE()` 
      : period === 'week' 
        ? `YEARWEEK(date_commande, 1) = YEARWEEK(CURDATE(), 1)` 
        : `date_commande >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;

    const [ventes30j] = await conn.query(`
      SELECT DATE_FORMAT(date_commande, '%d/%m') AS jour, SUM(montant_total) AS ventes
      FROM commandes
      WHERE ${windowCond}
        AND statut NOT IN ('annulee','refusee')
      GROUP BY DATE(date_commande)
      ORDER BY DATE(date_commande)
    `);

    // Commandes par statut (mois en cours)
    const [commandesParStatut] = await conn.query(`
      SELECT statut, COUNT(*) AS total
      FROM commandes
      WHERE ${periodCondition}
      GROUP BY statut
    `);

    conn.release();

    const stats = [
      {
        title: 'CA du jour',
        value: Math.round(caJourRows[0].total),
        color: 'bg-green-600',
      },
      {
        title: 'CA cumulé (mois)',
        value: Math.round(caMoisRows[0].total),
        color: 'bg-black',
      },
      {
        title: 'Commandes du jour',
        value: cmdJourRows[0].total,
        color: 'bg-gray-900',
      },
      {
        title: 'Panier moyen (jour)',
        value: Math.round(avgJourRows[0].avg_total),
        color: 'bg-gray-800',
      },
      {
        title: 'Produits',
        value: produits[0].total,
        color: 'bg-green-600',
      },
      {
        title: 'Commandes (total)',
        value: commandes[0].total,
        color: 'bg-black',
      },
    ];

    res.status(200).json({ stats, ventesParMois, ventes30j, commandesParStatut, categories, period });
  } catch (error) {
    console.error('Erreur API dashboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
