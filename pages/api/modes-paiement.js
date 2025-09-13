import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Récupérer tous les modes de paiement actifs avec les informations de frais
    const [modesPaiement] = await pool.query(`
      SELECT 
        id,
        code_paiement,
        nom,
        description,
        icone,
        couleur,
        ordre_affichage,
        actif,
        type,
        categorie,
        frais_fixes,
        frais_pourcentage,
        frais_minimum,
        frais_maximum,
        montant_minimum,
        montant_maximum,
        devise_par_defaut,
        validation_requise,
        confirmation_requise,
        delai_validation,
        instructions,
        support_telephone,
        support_email
      FROM modes_paiement 
      WHERE actif = 1 AND disponible_vente = 1
      ORDER BY ordre_affichage ASC, nom ASC
    `);

    // Calculer les frais pour chaque mode de paiement
    const modesAvecFrais = modesPaiement.map(mode => {
      // Corriger les types vides basés sur le code_paiement
      let typeCorrige = mode.type;
      if (!typeCorrige || typeCorrige === '') {
        switch (mode.code_paiement) {
          case 'FREE_MONEY':
            typeCorrige = 'autre';
            break;
          case 'VIREMENT_BANCAIRE':
            typeCorrige = 'virement';
            break;
          default:
            typeCorrige = mode.type || 'autre';
        }
      }

      const calculerFrais = (montant) => {
        const fraisFixes = parseFloat(mode.frais_fixes) || 0;
        const fraisPourcentage = parseFloat(mode.frais_pourcentage) || 0;
        const fraisMin = parseFloat(mode.frais_minimum) || 0;
        const fraisMax = parseFloat(mode.frais_maximum) || Infinity;
        
        const fraisPourcentageMontant = (montant * fraisPourcentage) / 100;
        let fraisTotaux = fraisFixes + fraisPourcentageMontant;
        
        // Appliquer les limites min/max
        fraisTotaux = Math.max(fraisTotaux, fraisMin);
        fraisTotaux = Math.min(fraisTotaux, fraisMax);
        
        return {
          frais_fixes: fraisFixes,
          frais_pourcentage: fraisPourcentage,
          frais_calcules: fraisTotaux,
          montant_net: montant - fraisTotaux
        };
      };

      return {
        ...mode,
        type: typeCorrige,
        calculerFrais
      };
    });

    return res.status(200).json({
      success: true,
      data: modesAvecFrais
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des modes de paiement:', error);
    
    // En cas d'erreur de base de données, retourner des données de test
    const modesPaiementTest = [
      {
        id: 1,
        code_paiement: 'CARTE_BANCAIRE',
        nom: 'Carte bancaire',
        description: 'Paiement par carte bancaire sécurisé',
        icone: '💳',
        couleur: '#3B82F6',
        ordre_affichage: 1,
        actif: 1,
        type: 'carte_bancaire',
        categorie: 'electronique',
        frais_fixes: 0,
        frais_pourcentage: 2.5,
        frais_minimum: 0,
        frais_maximum: 1000,
        montant_minimum: 1000,
        montant_maximum: 1000000,
        instructions: 'Veuillez saisir les informations de votre carte bancaire',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@example.com'
      },
      {
        id: 2,
        code_paiement: 'ORANGE_MONEY',
        nom: 'Orange Money',
        description: 'Paiement mobile avec Orange Money',
        icone: '🟠',
        couleur: '#FF6B35',
        ordre_affichage: 2,
        actif: 1,
        type: 'orange_money',
        categorie: 'electronique',
        frais_fixes: 25,
        frais_pourcentage: 0,
        frais_minimum: 25,
        frais_maximum: 500,
        montant_minimum: 500,
        montant_maximum: 500000,
        instructions: 'Saisissez votre numéro de portefeuille Orange Money',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@orange.sn'
      },
      {
        id: 3,
        code_paiement: 'WAVE',
        nom: 'Wave',
        description: 'Paiement mobile avec Wave',
        icone: '🌊',
        couleur: '#00B4D8',
        ordre_affichage: 3,
        actif: 1,
        type: 'wave',
        categorie: 'electronique',
        frais_fixes: 0,
        frais_pourcentage: 1.5,
        frais_minimum: 25,
        frais_maximum: 1000,
        montant_minimum: 1000,
        montant_maximum: 1000000,
        instructions: 'Saisissez votre numéro de portefeuille Wave',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@wave.sn'
      },
      {
        id: 4,
        code_paiement: 'KPAY',
        nom: 'Kpay',
        description: 'Paiement mobile avec Kpay',
        icone: '💙',
        couleur: '#1E40AF',
        ordre_affichage: 4,
        actif: 1,
        type: 'autre',
        categorie: 'electronique',
        frais_fixes: 0,
        frais_pourcentage: 1.0,
        frais_minimum: 25,
        frais_maximum: 500,
        montant_minimum: 1000,
        montant_maximum: 500000,
        instructions: 'Saisissez votre numéro de portefeuille Kpay',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@kpay.sn'
      },
      {
        id: 5,
        code_paiement: 'PAYPAL',
        nom: 'PayPal',
        description: 'Paiement sécurisé avec PayPal',
        icone: '🔵',
        couleur: '#0070BA',
        ordre_affichage: 5,
        actif: 1,
        type: 'paypal',
        categorie: 'en_ligne',
        frais_fixes: 0,
        frais_pourcentage: 3.4,
        frais_minimum: 50,
        frais_maximum: 2000,
        montant_minimum: 1000,
        montant_maximum: 1000000,
        instructions: 'Vous serez redirigé vers PayPal pour finaliser le paiement',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@paypal.com'
      },
      {
        id: 6,
        code_paiement: 'STRIPE',
        nom: 'Stripe',
        description: 'Paiement sécurisé avec Stripe',
        icone: '💜',
        couleur: '#635BFF',
        ordre_affichage: 6,
        actif: 1,
        type: 'stripe',
        categorie: 'en_ligne',
        frais_fixes: 0,
        frais_pourcentage: 2.9,
        frais_minimum: 50,
        frais_maximum: 1500,
        montant_minimum: 1000,
        montant_maximum: 1000000,
        instructions: 'Vous serez redirigé vers Stripe pour finaliser le paiement',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@stripe.com'
      },
      {
        id: 7,
        code_paiement: 'VIREMENT',
        nom: 'Virement bancaire',
        description: 'Paiement par virement bancaire',
        icone: '🏦',
        couleur: '#059669',
        ordre_affichage: 7,
        actif: 1,
        type: 'virement',
        categorie: 'virement',
        frais_fixes: 0,
        frais_pourcentage: 0,
        frais_minimum: 0,
        frais_maximum: 0,
        montant_minimum: 5000,
        montant_maximum: 10000000,
        instructions: 'Effectuez un virement et saisissez la référence',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@banque.sn'
      },
      {
        id: 8,
        code_paiement: 'CHEQUE',
        nom: 'Chèque',
        description: 'Paiement par chèque',
        icone: '📝',
        couleur: '#7C3AED',
        ordre_affichage: 8,
        actif: 1,
        type: 'cheque',
        categorie: 'physique',
        frais_fixes: 0,
        frais_pourcentage: 0,
        frais_minimum: 0,
        frais_maximum: 0,
        montant_minimum: 1000,
        montant_maximum: 1000000,
        instructions: 'Saisissez le numéro de votre chèque',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@example.com'
      },
      {
        id: 9,
        code_paiement: 'ESPECES',
        nom: 'Espèces',
        description: 'Paiement en espèces à la livraison',
        icone: '💰',
        couleur: '#10B981',
        ordre_affichage: 9,
        actif: 1,
        type: 'especes',
        categorie: 'physique',
        frais_fixes: 0,
        frais_pourcentage: 0,
        frais_minimum: 0,
        frais_maximum: 0,
        montant_minimum: 0,
        montant_maximum: 1000000,
        instructions: 'Vous paierez en espèces lors de la livraison',
        support_telephone: '+221 33 123 45 67',
        support_email: 'support@example.com'
      }
    ];

    // Ajouter la fonction calculerFrais aux modes de test
    const modesAvecFraisTest = modesPaiementTest.map(mode => {
      const calculerFrais = (montant) => {
        const fraisFixes = parseFloat(mode.frais_fixes) || 0;
        const fraisPourcentage = parseFloat(mode.frais_pourcentage) || 0;
        const fraisMin = parseFloat(mode.frais_minimum) || 0;
        const fraisMax = parseFloat(mode.frais_maximum) || Infinity;
        
        const fraisPourcentageMontant = (montant * fraisPourcentage) / 100;
        let fraisTotaux = fraisFixes + fraisPourcentageMontant;
        
        // Appliquer les limites min/max
        fraisTotaux = Math.max(fraisTotaux, fraisMin);
        fraisTotaux = Math.min(fraisTotaux, fraisMax);
        
        return {
          frais_fixes: fraisFixes,
          frais_pourcentage: fraisPourcentage,
          frais_calcules: fraisTotaux,
          montant_net: montant - fraisTotaux
        };
      };

      return {
        ...mode,
        calculerFrais
      };
    });

    return res.status(200).json({
      success: true,
      data: modesAvecFraisTest,
      fallback: true
    });
  }
}
