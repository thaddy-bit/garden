import multer from "multer";
// import pool from "../../lib/db";
import { pool } from '@/lib/db';
import path from "path";
// import fs from "fs";

// Configuration de multer pour enregistrer les images
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/store", // Dossier où enregistrer l'image
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour éviter les conflits
    },
  }),
});

// Middleware pour gérer l'upload d'image
export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser pour gérer l'upload avec multer
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
      }

      try {
        const { nom, description, prix, quantite, categorie_id, sous_categorie_id, rating, reviews, isNew } = req.body;
        
        // Vérifier si un fichier a été uploadé
        if (!req.file) {
          return res.status(400).json({ error: "L'image est requise" });
        }

        // Récupérer l'URL de l'image
        const image_url = `/uploads/store/${req.file.filename}`;

        // Requête SQL pour insérer le produit
        const query = `
          INSERT INTO produits (nom, description, prix, quantite, image_url, catégorie_id, sous_catégorie_id, rating, reviews, isNew)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Exécuter la requête SQL
        const values = [nom, description, prix, quantite, image_url, categorie_id, sous_categorie_id, rating, reviews, isNew];
        await pool.query(query, values);

        res.status(201).json({ message: "Produit ajouté avec succès" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout du produit" });
      }
    });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
