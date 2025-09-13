import { pool } from '@/lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Multer storage for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/marques',
    filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { marqueId } = req.query;
  if (!marqueId) return res.status(400).json({ message: 'ID requis' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, nom, description, image_url, zone FROM marques WHERE id = ? LIMIT 1', [marqueId]);
      if (!rows.length) return res.status(404).json({ message: 'Introuvable' });
      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error('get marque error', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  if (req.method === 'PUT') {
    return upload.single('image')(req, res, async (err) => {
      if (err) return res.status(500).json({ message: "Erreur d'upload" });
      try {
        const { nom, description, zone } = req.body;
        // Fetch current to possibly delete old image if replaced
        const [rows] = await pool.query('SELECT image_url FROM marques WHERE id = ? LIMIT 1', [marqueId]);
        if (!rows.length) return res.status(404).json({ message: 'Introuvable' });
        let image_url = rows[0]?.image_url || null;
        if (req.file) {
          // new image uploaded
          const newUrl = `/uploads/marques/${req.file.filename}`;
          // delete old
          if (image_url && image_url.startsWith('/uploads/')) {
            const full = path.join(process.cwd(), 'public', image_url);
            try { if (fs.existsSync(full)) fs.unlinkSync(full); } catch (_) {}
          }
          image_url = newUrl;
        }

        await pool.query(
          'UPDATE marques SET nom = ?, description = ?, zone = ?, image_url = ?, updated_at = NOW() WHERE id = ?',
          [nom, description, zone, image_url, marqueId]
        );
        return res.status(200).json({ message: 'Marque mise à jour' });
      } catch (e) {
        console.error('update marque error', e);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
    });
  }

  if (req.method === 'DELETE') {
    try {
      // find and delete image file
      const [rows] = await pool.query('SELECT image_url FROM marques WHERE id = ? LIMIT 1', [marqueId]);
      const image_url = rows?.[0]?.image_url;
      await pool.query('DELETE FROM marques WHERE id = ?', [marqueId]);
      if (image_url && image_url.startsWith('/uploads/')) {
        const full = path.join(process.cwd(), 'public', image_url);
        try { if (fs.existsSync(full)) fs.unlinkSync(full); } catch (_) {}
      }
      return res.status(200).json({ message: 'Marque supprimée' });
    } catch (e) {
      console.error('delete marque error', e);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}


