import { pool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    client_id,
    produits,
    montant_total,
    mode_paiement,
    montant_recu,
    monnaie_rendue
  } = req.body;

  if (!produits || produits.length === 0) {
    return res.status(400).json({ error: "Aucun produit dans la vente" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Si pas de client_id, créer un client anonyme
    let finalClientId = client_id;
    if (!client_id) {
      const [clientResult] = await connection.execute(
        `INSERT INTO client (nom, prenom, email, telephone, password) 
         VALUES (?, ?, ?, ?, ?)`,
        ['Client', 'Anonyme', 'anonyme@boutique.com', '0000000000', 'anonymous']
      );
      finalClientId = clientResult.insertId;
    }

    // Générer un numéro de commande unique
    const numeroCommande = `CMD-${Date.now()}`;

    // Créer la commande
    const [commandeResult] = await connection.execute(
      `INSERT INTO commandes (
        numero_commande, 
        client_id, 
        montant_sous_total, 
        montant_total, 
        statut, 
        date_commande
      ) VALUES (?, ?, ?, ?, 'livree', NOW())`,
      [numeroCommande, finalClientId, montant_total, montant_total]
    );

    const commandeId = commandeResult.insertId;

    // Ajouter les détails de commande et mettre à jour le stock
    for (const produit of produits) {
      // Ajouter le détail de commande
      await connection.execute(
        `INSERT INTO commande_details (commande_id, produit_id, quantite, prix) 
         VALUES (?, ?, ?, ?)`,
        [commandeId, produit.produit_id, produit.quantite, produit.prix_unitaire]
      );

      // Mettre à jour le stock
      await connection.execute(
        `UPDATE produits 
         SET stock = stock - ? 
         WHERE id = ?`,
        [produit.quantite, produit.produit_id]
      );
    }

    // Créer le paiement
    const numeroTransaction = `TXN-${Date.now()}`;
    
    // Récupérer l'ID du mode de paiement depuis la base de données
    const [modePaiementData] = await connection.execute(
      `SELECT id FROM modes_paiement WHERE code_paiement = ? AND actif = 1`,
      [mode_paiement.toUpperCase()]
    );
    
    const modePaiementId = modePaiementData.length > 0 ? modePaiementData[0].id : 1; // Par défaut : Espèces
    
    await connection.execute(
      `INSERT INTO paiements (
        numero_transaction,
        commande_id,
        client_id,
        montant,
        montant_devise_base,
        type_transaction,
        sens_transaction,
        categorie,
        mode_paiement_id,
        methode_paiement,
        statut,
        date_validation,
        created_at
      ) VALUES (?, ?, ?, ?, ?, 'vente_produit', 'credit', 'vente', ?, ?, 'valide', NOW(), NOW())`,
      [
        numeroTransaction,
        commandeId,
        finalClientId,
        montant_total,
        montant_total,
        modePaiementId,
        mode_paiement
      ]
    );

    await connection.commit();

    // Récupérer les informations de la commande créée
    const [commandeData] = await connection.execute(
      `SELECT 
        c.*,
        cl.nom as client_nom,
        cl.prenom as client_prenom
      FROM commandes c
      LEFT JOIN client cl ON c.client_id = cl.id
      WHERE c.id = ?`,
      [commandeId]
    );

    res.status(200).json({
      success: true,
      numero_commande: numeroCommande,
      commande_id: commandeId,
      numero_transaction: numeroTransaction,
      date_commande: commandeData[0].date_commande,
      montant_total: montant_total,
      mode_paiement: mode_paiement,
      montant_recu: montant_recu,
      monnaie_rendue: monnaie_rendue,
      client_nom: commandeData[0].client_nom ? 
        `${commandeData[0].client_prenom} ${commandeData[0].client_nom}` : 'Client Anonyme'
    });

  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la vente:", error);
    res.status(500).json({ error: "Erreur lors de la vente" });
  } finally {
    connection.release();
  }
}
