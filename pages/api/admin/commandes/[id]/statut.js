import { pool } from "@/lib/db";
import { 
  isStatusTransitionAllowed, 
  generateTrackingNumber, 
  getStepFromStatus,
  shouldGenerateTrackingNumber,
  isCarrierRequired 
} from "@/lib/statusWorkflow";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const connection = await pool.getConnection();

  try {
    const { id: commande_id } = req.query;
    const { 
      statut, 
      etape_actuelle = null,
      notes_internes = null,
      numero_suivi = null,
      transporteur = null,
      url_suivi = null,
      date_livraison_prevue = null,
      date_livraison_reelle = null,
      commentaires_livraison = null,
      raison_annulation = null
    } = req.body;

    if (!commande_id || !statut) {
      return res.status(400).json({ error: "ID de commande et statut requis" });
    }

    // Vérifier que la commande existe
    const [commandeExistante] = await connection.query(
      `SELECT id, statut, numero_commande FROM commandes WHERE id = ?`,
      [commande_id]
    );

    if (commandeExistante.length === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    const commande = commandeExistante[0];

    // Valider la transition de statut selon le workflow
    if (!isStatusTransitionAllowed(commande.statut, statut)) {
      return res.status(400).json({ 
        error: `Transition non autorisée de "${commande.statut}" vers "${statut}"`,
        currentStatus: commande.statut,
        requestedStatus: statut
      });
    }

    // Déterminer l'étape actuelle automatiquement
    const etapeFinale = getStepFromStatus(statut);

    // Générer automatiquement le numéro de suivi si nécessaire
    let numeroSuiviFinal = numero_suivi;
    if (shouldGenerateTrackingNumber(statut) && !numero_suivi) {
      numeroSuiviFinal = generateTrackingNumber();
    }

    // Valider que le transporteur est fourni si requis
    if (isCarrierRequired(statut) && !transporteur) {
      return res.status(400).json({ 
        error: `Le transporteur est requis pour le statut "${statut}"` 
      });
    }

    // Préparer les champs à mettre à jour
    const updates = [];
    const values = [];

    updates.push('statut = ?');
    values.push(statut);

    updates.push('etape_actuelle = ?');
    values.push(etapeFinale);

    updates.push('updated_at = NOW()');

    // Ajouter les champs optionnels
    if (notes_internes !== null) {
      updates.push('notes_internes = ?');
      values.push(notes_internes);
    }

    if (numeroSuiviFinal !== null) {
      updates.push('numero_suivi = ?');
      values.push(numeroSuiviFinal);
    }

    if (transporteur !== null) {
      updates.push('transporteur = ?');
      values.push(transporteur);
    }

    if (url_suivi !== null) {
      updates.push('url_suivi = ?');
      values.push(url_suivi);
    }

    if (date_livraison_prevue !== null) {
      updates.push('date_livraison_prevue = ?');
      values.push(date_livraison_prevue);
    }

    if (date_livraison_reelle !== null) {
      updates.push('date_livraison_reelle = ?');
      values.push(date_livraison_reelle);
    }

    if (commentaires_livraison !== null) {
      updates.push('commentaires_livraison = ?');
      values.push(commentaires_livraison);
    }

    if (raison_annulation !== null) {
      updates.push('raison_annulation = ?');
      values.push(raison_annulation);
    }

    // Ajouter la date d'annulation si le statut est annulé
    if (statut === 'annulee' && commande.statut !== 'annulee') {
      updates.push('date_annulation = NOW()');
    }

    // Ajouter la date de livraison réelle si le statut est livré
    if (statut === 'livree' && commande.statut !== 'livree') {
      updates.push('date_livraison_reelle = NOW()');
    }

    values.push(commande_id);

    // Exécuter la mise à jour
    const [result] = await connection.query(
      `UPDATE commandes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "Échec de la mise à jour" });
    }

    // Récupérer la commande mise à jour avec toutes les informations
    const [commandeMiseAJour] = await connection.query(
      `SELECT 
        c.*,
        cl.nom as client_nom,
        cl.prenom as client_prenom,
        cl.email as client_email,
        cl.telephone as client_telephone,
        COALESCE(mp.nom, c.methode_paiement, 'Non spécifié') as mode_paiement_nom,
        COALESCE(mp.type, 'especes') as mode_paiement_type,
        COALESCE(mp.icone, '💵') as mode_paiement_icone
      FROM commandes c
      LEFT JOIN client cl ON c.client_id = cl.id
      LEFT JOIN modes_paiement mp ON c.mode_paiement_id = mp.id
      WHERE c.id = ?`,
      [commande_id]
    );

    // Récupérer les détails des produits
    const [details] = await connection.query(
      `SELECT 
        cd.*,
        p.nom,
        p.slug,
        p.prix as prix_actuel,
        pi.image_url,
        m.nom as marque_nom
      FROM commande_details cd
      JOIN produits p ON cd.produit_id = p.id
      LEFT JOIN marques m ON p.marque_id = m.id
      LEFT JOIN produit_images pi ON p.id = pi.produit_id AND pi.is_principal = 1
      WHERE cd.commande_id = ?`,
      [commande_id]
    );

    res.status(200).json({
      message: "Statut de commande mis à jour avec succès",
      commande: {
        ...commandeMiseAJour[0],
        produits: details
      },
      ancien_statut: commande.statut,
      nouveau_statut: statut,
      numero_commande: commande.numero_commande,
      numero_suivi_generé: numeroSuiviFinal,
      etape_actuelle: etapeFinale
    });

  } catch (error) {
    console.error("Erreur mise à jour statut commande:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du statut." });
  } finally {
    connection.release();
  }
}
