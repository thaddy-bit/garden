import multer from 'multer';
import path from 'path';
import { pool } from "@/lib/db"; // Utilise ta propre configuration DB ici
import { NextApiRequest, NextApiResponse } from "next";
import { generateUniqueSlug } from "@/lib/slug";

// Configuration de multer pour gérer l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // On va stocker les fichiers dans le dossier public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Seuls les fichiers JPG, JPEG et PNG sont autorisés'));
    }
    cb(null, true);
  },
});

// Middleware pour l'upload des images
const uploadMiddleware = upload.array('gallery', 5); // Permet de télécharger jusqu'à 5 images

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;
  const {
    nom,
    description,
    prix,
    quantite,
    image_url,
    catégorie_id,
    sous_catégorie_id,
    rating,
    reviews,
    isNew,
    taille,
    couleur,
    materiau,
    marque,
    poids,
  } = req.body;

  switch (method) {
    case "GET":
      // Récupérer un produit par son ID
      try {
        const [product] = await pool.execute(
          "SELECT * FROM produits WHERE id = ?",
          [id]
        );

        if (product.length === 0) {
          return res.status(404).json({ message: "Produit non trouvé" });
        }

        res.status(200).json(product[0]);
      } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
      }
      break;

    case "POST":
      // Créer un nouveau produit (avec gestion des images)
      uploadMiddleware(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }

        const gallery = req.files.map((file) => `/uploads/${file.filename}`); // Construction du chemin d'accès aux images uploadées

        try {
          // Générer un slug unique
          const [existingSlugs] = await pool.query("SELECT slug FROM produits WHERE slug IS NOT NULL");
          const slug = generateUniqueSlug(nom, existingSlugs.map(row => row.slug));

          const insertQuery = `
            INSERT INTO produits (nom, slug, description, prix, quantite, image_url, catégorie_id, sous_catégorie_id, 
                                  rating, reviews, isNew, taille, couleur, materiau, marque, poids, gallery)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const insertValues = [
            nom,
            slug,
            description,
            prix,
            quantite,
            image_url,
            catégorie_id,
            sous_catégorie_id,
            rating,
            reviews,
            isNew,
            taille,
            couleur,
            materiau,
            marque,
            poids,
            JSON.stringify(gallery),  // Convertir gallery en JSON pour le stockage
          ];

          const [result] = await pool.execute(insertQuery, insertValues);

          res.status(201).json({ message: "Produit créé avec succès", id: result.insertId });
        } catch (err) {
          res.status(500).json({ message: "Erreur lors de la création du produit", error: err.message });
        }
      });
      break;

    case "PUT":
      // Mettre à jour un produit

      try {
        const updateQuery = `
          UPDATE produits 
          SET nom = ?, description = ?, prix = ?, quantite = ?, image_url = ?, catégorie_id = ?, 
              sous_catégorie_id = ?, rating = ?, reviews = ?, isNew = ?, taille = ?, couleur = ?, 
              materiau = ?, marque = ?, poids = ?, gallery = ? 
          WHERE id = ?
        `;

        const updateValues = [
          nom,
          description,
          prix,
          quantite,
          image_url,
          catégorie_id,
          sous_catégorie_id,
          rating,
          reviews,
          isNew,
          taille,
          couleur,
          materiau,
          marque,
          poids,
          JSON.stringify(gallery),  // Convertir gallery en JSON pour le stockage
          id,
        ];

        await pool.execute(updateQuery, updateValues);

        res.status(200).json({ message: "Produit mis à jour avec succès" });
      } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err.message });
      }
      break;

    case "DELETE":
      // Supprimer un produit
      try {
        await pool.execute("DELETE FROM produits WHERE id = ?", [id]);
        res.status(200).json({ message: "Produit supprimé avec succès" });
      } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}