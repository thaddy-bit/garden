import { pool } from "@/lib/db";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID de la commande manquant" });
  }

  const connection = await pool.getConnection();

  try {
    // Récupérer la commande avec informations client
    const [commandes] = await connection.query(
      `SELECT 
        c.*,
        cl.nom as client_nom,
        cl.prenom as client_prenom,
        cl.email as client_email,
        cl.telephone as client_telephone,
        mp.nom as mode_paiement_nom,
        mp.icone as mode_paiement_icone
      FROM commandes c
      LEFT JOIN client cl ON c.client_id = cl.id
      LEFT JOIN modes_paiement mp ON c.mode_paiement_id = mp.id
      WHERE c.id = ?`,
      [id]
    );

    if (commandes.length === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    const commande = commandes[0];

    // Récupérer les détails de la commande avec informations produits
    const [details] = await connection.query(
      `SELECT 
        cd.*,
        p.nom,
        p.slug,
        p.description,
        p.prix as prix_actuel,
        p.prix_reduction,
        p.pourcentage_reduction,
        m.nom as marque_nom,
        sc.nom as sous_categorie_nom,
        pi.image_url
      FROM commande_details cd
      JOIN produits p ON cd.produit_id = p.id
      LEFT JOIN marques m ON p.marque_id = m.id
      LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id
      LEFT JOIN produit_images pi ON p.id = pi.produit_id AND pi.is_principal = 1
      WHERE cd.commande_id = ?`,
      [id]
    );

    // Récupérer les informations de paiement
    const [paiements] = await connection.query(
      `SELECT 
        p.*,
        mp.nom as mode_paiement_nom,
        mp.icone as mode_paiement_icone
      FROM paiements p
      LEFT JOIN modes_paiement mp ON p.mode_paiement_id = mp.id
      WHERE p.commande_id = ? 
      ORDER BY p.created_at DESC`,
      [id]
    );

    // Créer le dossier factures s'il n'existe pas
    const facturesDir = path.join(process.cwd(), 'public', 'factures');
    if (!fs.existsSync(facturesDir)) {
      fs.mkdirSync(facturesDir, { recursive: true });
    }

    // Générer le PDF de la facture
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      info: {
        Title: `Facture ${commande.numero_commande}`,
        Author: 'Garden',
        Subject: 'Facture de commande',
        Creator: 'Garden E-commerce'
      }
    });

    // Configuration des couleurs modernes
    const primaryColor = '#1a202c';
    const secondaryColor = '#4a5568';
    const accentColor = '#2b6cb0';
    const lightGray = '#f7fafc';
    const darkGray = '#718096';
    const successColor = '#38a169';
    const borderColor = '#e2e8f0';

    // Header avec logo et informations
    doc.rect(0, 0, 595, 120)
       .fill(lightGray);

    // Logo Garden (image)
    const logoPath = path.join(process.cwd(), 'public', 'images', 'garden.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 20, { width: 70, height: 50 });
    } else {
      // Fallback si logo non trouvé
      doc.fillColor(accentColor)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('GARDEN', 50, 30);
    }

    // Informations de l'entreprise
    doc.fillColor(primaryColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('Garden', 140, 25);

    doc.fillColor(secondaryColor)
       .fontSize(9)
       .font('Helvetica')
       .text('E-commerce & Mode', 140, 45)
       .text('Dakar, Sénégal', 140, 58)
       .text('contact@garden.com', 140, 71)
       .text('+221 33 123 45 67', 140, 84);

    // Informations de facturation (carte moderne)
    doc.rect(400, 20, 180, 80)
       .fill('white')
       .stroke(borderColor);

    doc.fillColor(primaryColor)
       .fontSize(18)
       .font('Helvetica-Bold')
       .text('FACTURE', 420, 35);

    doc.fillColor(accentColor)
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(`#${commande.numero_commande}`, 420, 55);

    doc.fillColor(secondaryColor)
       .fontSize(9)
       .font('Helvetica')
       .text(`Date: ${new Date(commande.date_commande).toLocaleDateString('fr-FR')}`, 420, 75)
       .text(`Statut: ${commande.statut.toUpperCase()}`, 420, 88);

    // Informations client (carte moderne)
    doc.rect(50, 140, 250, 70)
       .fill('white')
       .stroke(borderColor);

    doc.fillColor(primaryColor)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('FACTURÉ À', 60, 155);

    doc.fillColor(secondaryColor)
       .fontSize(10)
       .font('Helvetica')
       .text(`${commande.client_prenom || ''} ${commande.client_nom || ''}`, 60, 175);

    if (commande.client_email) {
      doc.text(commande.client_email, 60, 190);
    }
    if (commande.client_telephone) {
      doc.text(commande.client_telephone, 60, 205);
    }

    // Adresse de livraison (carte moderne)
    doc.rect(320, 140, 250, 70)
       .fill('white')
       .stroke(borderColor);

    doc.fillColor(primaryColor)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('LIVRAISON', 330, 155);

    doc.fillColor(secondaryColor)
       .fontSize(10)
       .font('Helvetica')
       .text(commande.adresse_livraison || 'Non spécifiée', 330, 175);

    if (commande.ville_livraison) {
      doc.text(commande.ville_livraison, 330, 190);
    }
    if (commande.code_postal_livraison) {
      doc.text(commande.code_postal_livraison, 330, 205);
    }

    // Table des produits (design moderne)
    const tableTop = 230;
    const itemHeight = 30;
    let currentY = tableTop;

    // Titre de section
    doc.fillColor(primaryColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('DÉTAIL DE LA COMMANDE', 50, currentY);

    currentY += 30;

    // En-tête du tableau (design moderne)
    doc.rect(50, currentY, 495, 30)
       .fill(accentColor)
       .stroke(borderColor);

    doc.fillColor('white')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('PRODUIT', 60, currentY + 10)
       .text('MARQUE', 200, currentY + 10)
       .text('QTY', 320, currentY + 10)
       .text('PRIX UNIT.', 370, currentY + 10)
       .text('TOTAL', 470, currentY + 10);

    currentY += 30;

    // Lignes des produits (design alterné)
    details.forEach((produit, index) => {
      const isEven = index % 2 === 0;
      
      // Fond alterné
      if (isEven) {
        doc.rect(50, currentY, 495, itemHeight)
           .fill(lightGray)
           .stroke(borderColor);
      } else {
        doc.rect(50, currentY, 495, itemHeight)
           .fill('white')
           .stroke(borderColor);
      }

      // Nom du produit (gras)
      doc.fillColor(primaryColor)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(produit.nom, 60, currentY + 12);

      // Marque
      doc.fillColor(secondaryColor)
         .fontSize(10)
         .font('Helvetica')
         .text(produit.marque_nom || 'N/A', 200, currentY + 12);

      // Quantité (centré)
      doc.fillColor(primaryColor)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(produit.quantite.toString(), 320, currentY + 12, { align: 'center' });

      // Prix unitaire
      doc.fillColor(secondaryColor)
         .fontSize(10)
         .font('Helvetica')
         .text(`${parseFloat(produit.prix).toLocaleString('fr-FR')} FCFA`, 370, currentY + 12);

      // Total (gras)
      doc.fillColor(primaryColor)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(`${(parseFloat(produit.prix) * produit.quantite).toLocaleString('fr-FR')} FCFA`, 470, currentY + 12);

      currentY += itemHeight;
    });

    // Section des totaux (carte moderne)
    const totalY = currentY + 30;
    const totalBoxHeight = 120;
    
    // Fond de la section totaux
    doc.rect(350, totalY, 200, totalBoxHeight)
       .fill('white')
       .stroke(borderColor);

    // Titre de la section
    doc.fillColor(primaryColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('RÉCAPITULATIF', 360, totalY + 15);

    let totalYOffset = totalY + 35;

    // Sous-total
    doc.fillColor(secondaryColor)
       .fontSize(11)
       .font('Helvetica')
       .text('Sous-total:', 360, totalYOffset);

    doc.fillColor(primaryColor)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text(`${parseFloat(commande.montant_total).toLocaleString('fr-FR')} FCFA`, 500, totalYOffset);

    totalYOffset += 20;

    // Frais de livraison
    if (parseFloat(commande.frais_livraison) > 0) {
      doc.fillColor(secondaryColor)
         .fontSize(11)
         .font('Helvetica')
         .text('Frais de livraison:', 360, totalYOffset);

      doc.fillColor(primaryColor)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(`${parseFloat(commande.frais_livraison).toLocaleString('fr-FR')} FCFA`, 500, totalYOffset);

      totalYOffset += 20;
    }

    // Taxe
    if (parseFloat(commande.taxe) > 0) {
      doc.fillColor(secondaryColor)
         .fontSize(11)
         .font('Helvetica')
         .text('Taxe:', 360, totalYOffset);

      doc.fillColor(primaryColor)
         .fontSize(11)
         .font('Helvetica-Bold')
         .text(`${parseFloat(commande.taxe).toLocaleString('fr-FR')} FCFA`, 500, totalYOffset);

      totalYOffset += 20;
    }

    // Ligne de séparation
    doc.strokeColor(borderColor)
       .lineWidth(1)
       .moveTo(360, totalYOffset)
       .lineTo(540, totalYOffset)
       .stroke();

    totalYOffset += 15;

    // Total final (mise en évidence)
    doc.fillColor(accentColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('TOTAL:', 360, totalYOffset);

    doc.fillColor(accentColor)
       .fontSize(16)
       .font('Helvetica-Bold')
       .text(`${parseFloat(commande.montant_total).toLocaleString('fr-FR')} FCFA`, 500, totalYOffset);

    // Informations de paiement (carte moderne)
    const paymentY = totalY + totalBoxHeight + 20;
    
    if (paiements.length > 0) {
      const paiement = paiements[0];
      
      doc.rect(50, paymentY, 250, 60)
         .fill('white')
         .stroke(borderColor);

      doc.fillColor(primaryColor)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('MODE DE PAIEMENT', 60, paymentY + 15);

      doc.fillColor(secondaryColor)
         .fontSize(11)
         .font('Helvetica')
         .text(`${paiement.mode_paiement_nom || commande.methode_paiement || 'Non spécifié'}`, 60, paymentY + 35);

      if (paiement.numero_transaction) {
        doc.text(`Transaction: ${paiement.numero_transaction}`, 60, paymentY + 50);
      }
    }

    // Footer moderne
    const footerY = 750;
    
    // Ligne de séparation
    doc.strokeColor(borderColor)
       .lineWidth(1)
       .moveTo(50, footerY - 20)
       .lineTo(545, footerY - 20)
       .stroke();

    // Message de remerciement
    doc.fillColor(successColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('Merci pour votre confiance !', 50, footerY, { align: 'center' });

    // Informations de contact
    doc.fillColor(darkGray)
       .fontSize(9)
       .font('Helvetica')
       .text('Garden - E-commerce & Mode', 50, footerY + 20, { align: 'center' })
       .text('Email: contact@garden.com | Tél: +221 33 123 45 67', 50, footerY + 35, { align: 'center' })
       .text('Dakar, Sénégal', 50, footerY + 50, { align: 'center' });

    // Finaliser le PDF
    const fileName = `facture_${commande.numero_commande}.pdf`;
    
    // Créer un buffer pour le PDF
    const chunks = [];
    
    // Configurer les headers avant de commencer l'écriture
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Écrire le PDF directement dans la réponse
    doc.pipe(res);
    doc.end();

  } catch (error) {
    console.error("Erreur génération facture:", error);
    res.status(500).json({ error: "Erreur lors de la génération de la facture." });
  } finally {
    connection.release();
  }
}