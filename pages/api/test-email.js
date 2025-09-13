// pages/api/test-email.js
import { generateInvoiceHTML, formatDeliveryType, formatPaymentMethod } from '../../lib/invoice-generator';

// Import conditionnel de Resend
let Resend;
try {
  Resend = require('resend').Resend;
} catch (error) {
  console.log('Resend non disponible:', error.message);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email requis' });
  }

  if (!Resend || !process.env.RESEND_API_KEY) {
    return res.status(500).json({ message: 'Resend non configuré' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Données de test pour la facture
  const testData = {
    commandeId: 'CMD-2025-TEST001',
    dateCommande: new Date().toLocaleDateString('fr-FR'),
    modePaiement: 'Orange Money',
    clientNom: 'Dupont',
    clientPrenom: 'Jean',
    clientEmail: email,
    clientTelephone: '+221 77 123 45 67',
    clientId: '1',
    panier: [
      {
        nom: 'T-shirt Premium',
        marque_nom: 'Garden Collection',
        sous_categorie_nom: 'Hauts',
        quantite: 2,
        prix: 15000,
        prix_reduction: 12000,
        image_url: '/images/products/tshirt.jpg'
      },
      {
        nom: 'Jean Slim',
        marque_nom: 'Urban Style',
        sous_categorie_nom: 'Pantalons',
        quantite: 1,
        prix: 25000,
        image_url: '/images/products/jean.jpg'
      }
    ],
    totalFinal: 49000,
    fraisLivraison: 0,
    discount: 6000,
    fraisTransaction: 0,
    montantNet: 49000,
    typeLivraison: 'À domicile',
    adresseLivraison: '123 Rue de la Paix, Dakar, Sénégal',
    villeLivraison: 'Dakar',
    codePostalLivraison: '10000',
    instructionsLivraison: 'Sonner à la porte principale',
    adresseFacturation: '123 Rue de la Paix, Dakar, Sénégal',
    detailsPaiement: {
      numeroPortefeuille: '77 123 45 67'
    }
  };

  try {
    // Générer le HTML de la facture
    const invoiceHTML = generateInvoiceHTML(testData);

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: 'Garden Concept Store <onboarding@resend.dev>',
      to: [email],
      subject: `Test - Facture de votre commande ${testData.commandeId} - Garden Concept Store`,
      html: invoiceHTML,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return res.status(500).json({ 
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error 
      });
    }

    console.log('Email de test envoyé avec succès:', data);
    return res.status(200).json({ 
      message: 'Email de test envoyé avec succès',
      data: data 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de test:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de l\'envoi de l\'email de test',
      error: error.message 
    });
  }
}






