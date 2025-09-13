import { pool } from '@/lib/db';
import multer from 'multer';
import path from 'path';
import { generateSlug } from '@/lib/slug';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/products',
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`),
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

  return upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
  ])(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: "Erreur d'upload: " + err.message });
    }
    
    try {
      const {
        // Informations de base
        nom = '',
        description = '',
        description_courte = '',
        prix = '0',
        prix_reduction = '0',
        pourcentage_reduction = '0',
        sku = '',
        
        // Stock
        stock = '0',
        stock_minimum = '0',
        
        // Variantes
        poids = '',
        dimensions = '',
        couleur = '',
        taille = '',
        materiau = '',
        
        // Relations
        marque_id = null,
        sous_categorie_id = null,
        collection_id = null,
        
        // Flags
        nouveaute = '0',
        en_vedette = '0',
        en_solde = '0',
        
        // SEO
        meta_titre = '',
        meta_description = '',
        tags = '',
      } = req.body || {};

      // Validation des champs obligatoires
      if (!nom.trim()) return res.status(400).json({ message: 'Le nom est requis' });
      if (!marque_id) return res.status(400).json({ message: 'La marque est requise' });
      if (!sous_categorie_id) return res.status(400).json({ message: 'La sous-catégorie est requise' });
      if (!req.files?.main_image?.[0]) return res.status(400).json({ message: 'L\'image principale est requise' });

      // Conversion des valeurs
      const prixInt = Math.max(0, parseInt(prix, 10) || 0);
      const prixReductionInt = Math.max(0, parseInt(prix_reduction, 10) || 0);
      const pourcentageReductionInt = Math.max(0, Math.min(100, parseInt(pourcentage_reduction, 10) || 0));
      const stockInt = Math.max(0, parseInt(stock, 10) || 0);
      const stockMinInt = Math.max(0, parseInt(stock_minimum, 10) || 0);
      const poidsFloat = parseFloat(poids) || null;
      
      // Génération du slug
      const slug = generateSlug(nom);

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        
        // Insertion du produit
        const [result] = await conn.query(
          `INSERT INTO produits (
            nom, slug, description, description_courte, prix, prix_reduction, pourcentage_reduction, sku,
            stock, stock_minimum, poids, dimensions, couleur, taille, materiau,
            marque_id, sous_categorie_id, collection_id,
            nouveaute, en_vedette, en_solde, actif,
            meta_titre, meta_description, tags,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            nom, slug, description || null, description_courte || null,
            prixInt, prixReductionInt, pourcentageReductionInt, sku || null,
            stockInt, stockMinInt, poidsFloat, dimensions || null, couleur || null, taille || null, materiau || null,
            marque_id, sous_categorie_id, collection_id || null,
            nouveaute === '1' ? 1 : 0, en_vedette === '1' ? 1 : 0, en_solde === '1' ? 1 : 0, 1,
            meta_titre || null, meta_description || null, tags || null
          ]
        );
        
        const produitId = result.insertId;

        // Insertion de l'image principale
        if (req.files?.main_image?.[0]) {
          const mainImageUrl = `/uploads/products/${req.files.main_image[0].filename}`;
          await conn.query(
            `INSERT INTO produit_images (produit_id, image_url, is_principal, ordre) VALUES (?, ?, 1, 0)`,
            [produitId, mainImageUrl]
          );
        }

        // Insertion des images de galerie
        if (req.files?.gallery_images && req.files.gallery_images.length > 0) {
          for (let i = 0; i < req.files.gallery_images.length; i++) {
            const galleryImageUrl = `/uploads/products/${req.files.gallery_images[i].filename}`;
            await conn.query(
              `INSERT INTO produit_images (produit_id, image_url, is_principal, ordre) VALUES (?, ?, 0, ?)`,
              [produitId, galleryImageUrl, i + 1]
            );
          }
        }

        await conn.commit();
        return res.status(201).json({ 
          message: 'Produit ajouté avec succès', 
          id: produitId,
          slug: slug
        });
        
      } catch (e) {
        await conn.rollback();
        console.error('Database error:', e);
        return res.status(500).json({ message: 'Erreur lors de l\'ajout du produit' });
      } finally {
        conn.release();
      }
      
    } catch (e) {
      console.error('Handler error:', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });
}


