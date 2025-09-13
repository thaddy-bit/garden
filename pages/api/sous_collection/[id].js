// pages/api/products/[categoryId].js

import { pool } from '@/lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/sous_categories',
    filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  console.log("Id collections reçues :", id); // <- Ajoute ça 

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nom, description, image_url FROM sous_categories WHERE id = ?',
        [id]
      );
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Erreur GET sous_categories :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'PUT') {
    return upload.single('image')(req, res, async (err) => {
      if (err) return res.status(500).json({ error: "Erreur d'upload" });
      try {
        const { nom, description } = req.body;
        const [rows] = await pool.query('SELECT image_url FROM sous_categories WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Introuvable' });
        let image_url = rows[0]?.image_url || null;
        if (req.file) {
          const newUrl = `/uploads/sous_categories/${req.file.filename}`;
          if (image_url && image_url.startsWith('/uploads/')) {
            const full = path.join(process.cwd(), 'public', image_url);
            try { if (fs.existsSync(full)) fs.unlinkSync(full); } catch (_) {}
          }
          image_url = newUrl;
        }
        await pool.query('UPDATE sous_categories SET nom = ?, description = ?, image_url = ?, updated_at = NOW() WHERE id = ?', [nom, description || null, image_url, id]);
        return res.status(200).json({ message: 'Sous catégorie mise à jour' });
      } catch (error) {
        console.error('Erreur UPDATE sous_categories :', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
    });
  }

  if (req.method === 'DELETE') {
    try {
      const [rows] = await pool.query('SELECT image_url FROM sous_categories WHERE id = ? LIMIT 1', [id]);
      const image_url = rows?.[0]?.image_url;
      await pool.query('DELETE FROM sous_categories WHERE id = ?', [id]);
      if (image_url && image_url.startsWith('/uploads/')) {
        const full = path.join(process.cwd(), 'public', image_url);
        try { if (fs.existsSync(full)) fs.unlinkSync(full); } catch (_) {}
      }
      return res.status(200).json({ message: 'Sous catégorie supprimée' });
    } catch (error) {
      console.error('Erreur DELETE sous_categories :', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}

