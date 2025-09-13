const fs = require('fs');
const path = require('path');

function generateInvoiceHTML(commandeData) {
  try {
    // Lire le template HTML
    const templatePath = path.join(process.cwd(), 'templates', 'invoice-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Générer les lignes de produits
    let produitsRows = '';
    commandeData.panier.forEach(item => {
      const prix = item.prix_reduction || item.prix;
      const prixTotal = prix * item.quantite;
      
      produitsRows += `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              ${item.image_url ? `<img src="${item.image_url}" alt="${item.nom}" class="product-image">` : ''}
              <div>
                <strong>${item.nom}</strong>
                <br><small style="color: #6b7280;">${item.sous_categorie_nom}</small>
              </div>
            </div>
          </td>
          <td>${item.marque_nom || 'N/A'}</td>
          <td>${item.quantite}</td>
          <td>${prix.toLocaleString('fr-FR')} FCFA</td>
          <td><strong>${prixTotal.toLocaleString('fr-FR')} FCFA</strong></td>
        </tr>
      `;
    });
    
    // Calculer les totaux
    const nombreArticles = commandeData.panier.reduce((total, item) => total + item.quantite, 0);
    const subtotal = commandeData.panier.reduce((total, item) => {
      const prix = item.prix_reduction || item.prix;
      return total + (prix * item.quantite);
    }, 0);
    
    // Générer les lignes conditionnelles
    const discountRow = commandeData.discount > 0 ? `
      <div class="price-row discount">
        <span>Remise</span>
        <span>-${commandeData.discount.toLocaleString('fr-FR')} FCFA</span>
      </div>
    ` : '';
    
    const fraisTransactionRow = commandeData.fraisTransaction > 0 ? `
      <div class="price-row">
        <span>Frais de transaction</span>
        <span>${commandeData.fraisTransaction.toLocaleString('fr-FR')} FCFA</span>
      </div>
    ` : '';
    
    const villeLivraisonRow = commandeData.villeLivraison ? `
      <p><strong>Ville :</strong> ${commandeData.villeLivraison}</p>
    ` : '';
    
    const codePostalRow = commandeData.codePostalLivraison ? `
      <p><strong>Code postal :</strong> ${commandeData.codePostalLivraison}</p>
    ` : '';
    
    // Générer les détails de paiement spécifiques
    let detailsPaiement = '';
    if (commandeData.detailsPaiement) {
      switch (commandeData.modePaiement) {
        case 'orange_money':
        case 'wave':
        case 'autre':
          if (commandeData.detailsPaiement.numeroPortefeuille) {
            detailsPaiement = `<p><strong>Numéro de portefeuille :</strong> ${commandeData.detailsPaiement.numeroPortefeuille}</p>`;
          }
          break;
        case 'carte_bancaire':
          detailsPaiement = `
            <p><strong>Numéro de carte :</strong> ${commandeData.detailsPaiement.numeroCarte || 'N/A'}</p>
            <p><strong>Nom sur la carte :</strong> ${commandeData.detailsPaiement.nomCarte || 'N/A'}</p>
            <p><strong>Date d'expiration :</strong> ${commandeData.detailsPaiement.dateExpiration || 'N/A'}</p>
          `;
          break;
        case 'virement':
          if (commandeData.detailsPaiement.referenceVirement) {
            detailsPaiement = `<p><strong>Référence de virement :</strong> ${commandeData.detailsPaiement.referenceVirement}</p>`;
          }
          break;
        case 'cheque':
          if (commandeData.detailsPaiement.numeroCheque) {
            detailsPaiement = `<p><strong>Numéro de chèque :</strong> ${commandeData.detailsPaiement.numeroCheque}</p>`;
          }
          break;
        case 'paypal':
          if (commandeData.detailsPaiement.emailPaypal) {
            detailsPaiement = `<p><strong>Email PayPal :</strong> ${commandeData.detailsPaiement.emailPaypal}</p>`;
          }
          break;
        case 'stripe':
          if (commandeData.detailsPaiement.emailStripe) {
            detailsPaiement = `<p><strong>Email de facturation :</strong> ${commandeData.detailsPaiement.emailStripe}</p>`;
          }
          break;
        case 'especes':
          detailsPaiement = `<p><strong>Paiement :</strong> En espèces à la livraison</p>`;
          break;
      }
    }
    
    // Remplacer les variables dans le template
    const replacements = {
      '{{commande_id}}': commandeData.commandeId || 'N/A',
      '{{date_commande}}': commandeData.dateCommande || new Date().toLocaleDateString('fr-FR'),
      '{{mode_paiement}}': commandeData.modePaiement || 'N/A',
      '{{client_nom}}': commandeData.clientNom || 'N/A',
      '{{client_prenom}}': commandeData.clientPrenom || 'N/A',
      '{{client_email}}': commandeData.clientEmail || 'N/A',
      '{{client_telephone}}': commandeData.clientTelephone || 'N/A',
      '{{client_id}}': commandeData.clientId || 'N/A',
      '{{produits_rows}}': produitsRows,
      '{{nombre_articles}}': nombreArticles,
      '{{subtotal}}': subtotal.toLocaleString('fr-FR'),
      '{{frais_livraison}}': commandeData.fraisLivraison === 0 ? 'Gratuite' : `${commandeData.fraisLivraison.toLocaleString('fr-FR')} FCFA`,
      '{{discount_row}}': discountRow,
      '{{frais_transaction_row}}': fraisTransactionRow,
      '{{total_final}}': commandeData.totalFinal.toLocaleString('fr-FR'),
      '{{type_livraison}}': commandeData.typeLivraison || 'N/A',
      '{{adresse_livraison}}': commandeData.adresseLivraison || 'N/A',
      '{{ville_livraison_row}}': villeLivraisonRow,
      '{{code_postal_row}}': codePostalRow,
      '{{instructions_livraison}}': commandeData.instructionsLivraison || 'Aucune instruction spéciale',
      '{{adresse_facturation}}': commandeData.adresseFacturation || commandeData.adresseLivraison || 'N/A',
      '{{montant_net}}': commandeData.montantNet.toLocaleString('fr-FR'),
      '{{frais_transaction}}': commandeData.fraisTransaction.toLocaleString('fr-FR'),
      '{{details_paiement}}': detailsPaiement
    };
    
    // Appliquer tous les remplacements
    Object.keys(replacements).forEach(key => {
      template = template.replace(new RegExp(key, 'g'), replacements[key]);
    });
    
    return template;
  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error);
    throw error;
  }
}

function formatDeliveryType(type) {
  const types = {
    'standard': 'À domicile',
    'point_relais': 'Point relais',
    'retrait_magasin': 'Retrait en boutique',
    'express': 'Livraison express'
  };
  return types[type] || type;
}

function formatPaymentMethod(method) {
  const methods = {
    'orange_money': 'Orange Money',
    'wave': 'Wave',
    'carte_bancaire': 'Carte bancaire',
    'virement': 'Virement bancaire',
    'cheque': 'Chèque',
    'paypal': 'PayPal',
    'stripe': 'Stripe',
    'especes': 'Espèces',
    'autre': 'Autre portefeuille mobile'
  };
  return methods[method] || method;
}

module.exports = {
  generateInvoiceHTML,
  formatDeliveryType,
  formatPaymentMethod
};
