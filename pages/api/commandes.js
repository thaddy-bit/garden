// pages/api/commande.js
import { pool } from '@/lib/db';

// Import conditionnel des modules
let generateInvoiceHTML, formatDeliveryType, formatPaymentMethod;
let Resend;

try {
  const invoiceGenerator = require('../../lib/invoice-generator');
  generateInvoiceHTML = invoiceGenerator.generateInvoiceHTML;
  formatDeliveryType = invoiceGenerator.formatDeliveryType;
  formatPaymentMethod = invoiceGenerator.formatPaymentMethod;
} catch (error) {
  console.log('Invoice generator non disponible:', error.message);
}

try {
  Resend = require('resend').Resend;
} catch (error) {
  console.log('Resend non disponible:', error.message);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { 
    client_id, 
    livraison, 
    panier, 
    total, 
    adresse, 
    mode_paiement, 
    telephone, 
    email, 
    details_paiement, 
    frais_transaction, 
    montant_net,
    // Nouvelles informations de livraison
    type_livraison,
    ville_livraison,
    code_postal_livraison,
    instructions_livraison,
    adresse_facturation,
    // Informations pour la facture
    discount = 0
  } = req.body;

  if (!client_id || !Array.isArray(panier) || panier.length === 0 || livraison < 0) {
    return res.status(400).json({ error: 'Données invalides.' });
  }

  if (!telephone || !email) {
    return res.status(400).json({ error: 'Téléphone et email requis.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 🔹 Générer un numéro de commande unique
    const numeroCommande = `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // 🔹 Récupérer les informations du client
    const [clientResult] = await connection.query(
      `SELECT nom, prenom, email FROM client WHERE id = ?`,
      [client_id]
    );
    
    if (clientResult.length === 0) {
      throw new Error('Client non trouvé');
    }
    
    const client = clientResult[0];
    
    // 🔹 Insertion dans commandes avec les nouveaux champs
    const [commandeResult] = await connection.query(
      `INSERT INTO commandes (
        numero_commande,
        client_id, 
        frais_livraison, 
        montant_total, 
        statut, 
        adresse_livraison, 
        methode_paiement,
        telephone_livraison,
        type_livraison,
        ville_livraison,
        code_postal_livraison,
        instructions_livraison,
        adresse_facturation,
        notes_client
      ) VALUES (?, ?, ?, ?, 'en_attente', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numeroCommande,
        client_id, 
        livraison, 
        total, 
        adresse, 
        mode_paiement,
        telephone,
        type_livraison || 'standard',
        ville_livraison || '',
        code_postal_livraison || '',
        instructions_livraison || '',
        adresse_facturation || adresse,
        `Email: ${email} | Détails paiement: ${JSON.stringify(details_paiement || {})} | Frais transaction: ${frais_transaction || 0} | Montant net: ${montant_net || total}`
      ]
    );
    const commandeId = commandeResult.insertId;
    
    // 🔸 Insertion des détails de commande
    for (const item of panier) {
      const [produit] = await connection.query(
        `SELECT id FROM produits WHERE produits.id = ?`,
        [item.produit_id]
      );
      if (produit.length === 0) {
        console.error(`Produit avec id ${item.produit_id} introuvable.`);
        throw new Error(`Produit avec id ${item.produit_id} introuvable.`);
      }

      await connection.query(
        `INSERT INTO commande_details (commande_id, produit_id, quantite, prix) VALUES (?, ?, ?, ?)`,
        [commandeId, item.produit_id, item.quantite, item.prix]
      );
    }

    // 🔹 Récupérer le mode_paiement_id correct
    let modePaiementId = 1; // Par défaut Espèces
    if (mode_paiement && mode_paiement !== 'ESPECES') {
      const [modePaiementResult] = await connection.query(
        `SELECT id FROM modes_paiement WHERE code_paiement = ? OR nom = ? LIMIT 1`,
        [mode_paiement, mode_paiement]
      );
      if (modePaiementResult.length > 0) {
        modePaiementId = modePaiementResult[0].id;
      }
    }

    // 🔹 Enregistrer le paiement dans la table paiements
    const numeroTransaction = `TXN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const [paiementResult] = await connection.query(
      `INSERT INTO paiements (
        numero_transaction,
        commande_id,
        client_id,
        mode_paiement_id,
        montant,
        devise,
        montant_devise_base,
        type_transaction,
        sens_transaction,
        categorie,
        methode_paiement,
        details_paiement,
        statut,
        frais_transaction,
        montant_net
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numeroTransaction,
        commandeId,
        client_id,
        modePaiementId, // mode_paiement_id correct
        total,
        'XOF', // Devise
        total, // Montant en devise de base
        'vente_produit', // Type de transaction
        'credit', // Sens de la transaction
        'vente', // Catégorie
        mode_paiement || 'ESPECES', // Méthode de paiement
        JSON.stringify(details_paiement || {}),
        'paye', // Statut du paiement
        frais_transaction || 0,
        montant_net || total
      ]
    );

    // ✅ Vider le panier du client
    await connection.query(`DELETE FROM panier WHERE client_id = ?`, [client_id]);

    await connection.commit();

    // 📧 Envoyer la facture par email
    try {
      await sendInvoiceEmail({
        commandeId,
        numeroCommande,
        client: {
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: telephone,
          id: client_id
        },
        panier,
        total,
        livraison,
        discount,
        frais_transaction: frais_transaction || 0,
        montant_net: montant_net || total,
        mode_paiement,
        details_paiement,
        adresse,
        type_livraison,
        ville_livraison,
        code_postal_livraison,
        instructions_livraison,
        adresse_facturation: adresse_facturation || adresse
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de la facture:', emailError);
      // Ne pas faire échouer la commande si l'email échoue
    }

    res.status(200).json({ 
      message: 'Commande enregistrée avec succès et facture envoyée par email.',
      commande_id: commandeId,
      paiement_id: paiementResult.insertId,
      numero_commande: numeroCommande
    });
  } catch (error) {
    console.error('Erreur commande :', error);
    await connection.rollback();
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la commande." });
  } finally {
    connection.release();
  }
}

// Fonction pour envoyer la facture par email
async function sendInvoiceEmail(commandeData) {
  if (!Resend || !process.env.RESEND_API_KEY) {
    console.log('Resend non configuré, facture générée mais non envoyée');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Générer le HTML de la facture
  const invoiceHTML = generateInvoiceHTML({
    commandeId: commandeData.numeroCommande,
    dateCommande: new Date().toLocaleDateString('fr-FR'),
    modePaiement: formatPaymentMethod(commandeData.mode_paiement),
    clientNom: commandeData.client.nom,
    clientPrenom: commandeData.client.prenom,
    clientEmail: commandeData.client.email,
    clientTelephone: commandeData.client.telephone,
    clientId: commandeData.client.id,
    panier: commandeData.panier,
    totalFinal: commandeData.total,
    fraisLivraison: commandeData.livraison,
    discount: commandeData.discount,
    fraisTransaction: commandeData.frais_transaction,
    montantNet: commandeData.montant_net,
    typeLivraison: formatDeliveryType(commandeData.type_livraison),
    adresseLivraison: commandeData.adresse,
    villeLivraison: commandeData.ville_livraison,
    codePostalLivraison: commandeData.code_postal_livraison,
    instructionsLivraison: commandeData.instructions_livraison,
    adresseFacturation: commandeData.adresse_facturation,
    detailsPaiement: commandeData.details_paiement
  });

  try {
    const { data, error } = await resend.emails.send({
      from: 'Garden Concept Store <onboarding@resend.dev>',
      to: [commandeData.client.email],
      subject: `Facture de votre commande ${commandeData.numeroCommande} - Garden Concept Store`,
      html: invoiceHTML,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      throw error;
    }

    console.log('Facture envoyée avec succès:', data);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la facture:', error);
    throw error;
  }
}
