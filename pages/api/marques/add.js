import multer from "multer";
import path from "path";
// import pool from "../../../lib/db";
import { pool } from '@/lib/db';

// Configuration de multer pour enregistrer les images
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/marques", // Dossier où enregistrer l'image
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
        const { nom, description, zone } = req.body;
        
        // Vérifier si un fichier a été uploadé
        if (!req.file) {
          return res.status(400).json({ error: "L'image est requise" });
        }

        // Récupérer l'URL de l'image
        const image_url = `/uploads/marques/${req.file.filename}`;

        // Requête SQL pour insérer la marque
        const query = `
          INSERT INTO marques (nom, description, image_url, zone)
          VALUES (?, ?, ?, ?)
        `;

        // Exécuter la requête SQL
        const values = [nom, description, image_url, zone];
        await pool.query(query, values);

        res.status(201).json({ message: "Marque ajouté avec succès" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout de la marque" });
      }
    });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
