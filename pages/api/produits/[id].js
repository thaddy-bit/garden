import { pool } from '@/lib/db';
import multer from 'multer';
import path from 'path';
import { generateSlug } from '@/lib/slug';
import fs from 'fs';

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
  const { id } = req.query;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID produit invalide' });
  }

  const produitId = parseInt(id);

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, produitId);
    case 'PUT':
      return handlePut(req, res, produitId);
    case 'DELETE':
      return handleDelete(req, res, produitId);
    default:
      return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

// GET - Récupérer un produit avec ses images
async function handleGet(req, res, produitId) {
  try {
    const conn = await pool.getConnection();
    
    try {
      // Récupérer le produit
      const [produitRows] = await conn.query(
        `SELECT p.*, m.nom AS marque_nom, sc.nom AS sous_categorie_nom 
         FROM produits p 
         LEFT JOIN marques m ON p.marque_id = m.id 
         LEFT JOIN sous_categories sc ON p.sous_categorie_id = sc.id 
         WHERE p.id = ?`,
        [produitId]
      );

      if (produitRows.length === 0) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Récupérer les images
      const [imageRows] = await conn.query(
        `SELECT * FROM produit_images WHERE produit_id = ? ORDER BY is_principal DESC, ordre ASC`,
        [produitId]
      );

      const produit = produitRows[0];
      produit.images = imageRows;

      return res.status(200).json(produit);
      
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('GET produit error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// PUT - Modifier un produit
async function handlePut(req, res, produitId) {
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
        
        // Images à supprimer
        images_to_delete = '',
      } = req.body || {};

      // Validation des champs obligatoires
      if (!nom.trim()) return res.status(400).json({ message: 'Le nom est requis' });
      if (!marque_id) return res.status(400).json({ message: 'La marque est requise' });
      if (!sous_categorie_id) return res.status(400).json({ message: 'La sous-catégorie est requise' });

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
        
        // Vérifier que le produit existe
        const [existingRows] = await conn.query('SELECT id FROM produits WHERE id = ?', [produitId]);
        if (existingRows.length === 0) {
          return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Mise à jour du produit
        await conn.query(
          `UPDATE produits SET 
            nom = ?, slug = ?, description = ?, description_courte = ?, 
            prix = ?, prix_reduction = ?, pourcentage_reduction = ?, sku = ?,
            stock = ?, stock_minimum = ?, poids = ?, dimensions = ?, 
            couleur = ?, taille = ?, materiau = ?,
            marque_id = ?, sous_categorie_id = ?, collection_id = ?,
            nouveaute = ?, en_vedette = ?, en_solde = ?,
            meta_titre = ?, meta_description = ?, tags = ?,
            updated_at = NOW()
           WHERE id = ?`,
          [
            nom, slug, description || null, description_courte || null,
            prixInt, prixReductionInt, pourcentageReductionInt, sku || null,
            stockInt, stockMinInt, poidsFloat, dimensions || null, 
            couleur || null, taille || null, materiau || null,
            marque_id, sous_categorie_id, collection_id || null,
            nouveaute === '1' ? 1 : 0, en_vedette === '1' ? 1 : 0, en_solde === '1' ? 1 : 0,
            meta_titre || null, meta_description || null, tags || null,
            produitId
          ]
        );

        // Supprimer les images spécifiées
        if (images_to_delete) {
          const imageIdsToDelete = images_to_delete.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
          if (imageIdsToDelete.length > 0) {
            // Récupérer les chemins des images avant suppression
            const [imagesToDelete] = await conn.query(
              'SELECT image_url FROM produit_images WHERE id IN (?) AND produit_id = ?',
              [imageIdsToDelete, produitId]
            );
            
            // Supprimer de la base de données
            await conn.query(
              'DELETE FROM produit_images WHERE id IN (?) AND produit_id = ?',
              [imageIdsToDelete, produitId]
            );
            
            // Supprimer les fichiers
            imagesToDelete.forEach(img => {
              const filePath = `./public${img.image_url}`;
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            });
          }
        }

        // Ajouter nouvelle image principale si fournie
        if (req.files?.main_image?.[0]) {
          const mainImageUrl = `/uploads/products/${req.files.main_image[0].filename}`;
          
          // Supprimer l'ancienne image principale
          const [oldMainImages] = await conn.query(
            'SELECT image_url FROM produit_images WHERE produit_id = ? AND is_principal = 1',
            [produitId]
          );
          
          if (oldMainImages.length > 0) {
            const oldFilePath = `./public${oldMainImages[0].image_url}`;
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
            await conn.query('DELETE FROM produit_images WHERE produit_id = ? AND is_principal = 1', [produitId]);
          }
          
          // Insérer la nouvelle image principale
          await conn.query(
            `INSERT INTO produit_images (produit_id, image_url, is_principal, ordre) VALUES (?, ?, 1, 0)`,
            [produitId, mainImageUrl]
          );
        }

        // Ajouter nouvelles images de galerie
        if (req.files?.gallery_images && req.files.gallery_images.length > 0) {
          // Récupérer le prochain ordre disponible
          const [maxOrderRow] = await conn.query(
            'SELECT MAX(ordre) as max_order FROM produit_images WHERE produit_id = ?',
            [produitId]
          );
          let nextOrder = (maxOrderRow[0]?.max_order || 0) + 1;
          
          for (let i = 0; i < req.files.gallery_images.length; i++) {
            const galleryImageUrl = `/uploads/products/${req.files.gallery_images[i].filename}`;
            await conn.query(
              `INSERT INTO produit_images (produit_id, image_url, is_principal, ordre) VALUES (?, ?, 0, ?)`,
              [produitId, galleryImageUrl, nextOrder + i]
            );
          }
        }

        await conn.commit();
        return res.status(200).json({ 
          message: 'Produit modifié avec succès', 
          id: produitId,
          slug: slug
        });
        
      } catch (e) {
        await conn.rollback();
        console.error('Database error:', e);
        return res.status(500).json({ message: 'Erreur lors de la modification du produit' });
      } finally {
        conn.release();
      }
      
    } catch (e) {
      console.error('Handler error:', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  });
}

// DELETE - Supprimer un produit
async function handleDelete(req, res, produitId) {
  try {
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Vérifier que le produit existe
      const [existingRows] = await conn.query('SELECT id FROM produits WHERE id = ?', [produitId]);
      if (existingRows.length === 0) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Récupérer toutes les images du produit
      const [imageRows] = await conn.query(
        'SELECT image_url FROM produit_images WHERE produit_id = ?',
        [produitId]
      );

      // Supprimer les images de la base de données
      await conn.query('DELETE FROM produit_images WHERE produit_id = ?', [produitId]);

      // Supprimer le produit
      await conn.query('DELETE FROM produits WHERE id = ?', [produitId]);

      await conn.commit();

      // Supprimer les fichiers images
      imageRows.forEach(img => {
        const filePath = `./public${img.image_url}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      return res.status(200).json({ message: 'Produit supprimé avec succès' });
      
    } catch (e) {
      await conn.rollback();
      console.error('DELETE produit error:', e);
      return res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('DELETE handler error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}