import { pool } from '@/lib/db';
import multer from 'multer';
import path from 'path';

// Upload vers public/uploads/sous_categories
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  return upload.single('image')(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "Erreur d'upload" });
    try {
      const { nom, description } = req.body;
      if (!nom) return res.status(400).json({ error: 'Le nom est requis.' });
      if (!req.file) return res.status(400).json({ error: "L'image est requise." });
      const image_url = `/uploads/sous_categories/${req.file.filename}`;

      const [result] = await pool.execute(
        `INSERT INTO sous_categories (nom, description, image_url) VALUES (?, ?, ?)`,
        [nom, description || null, image_url]
      );
      res.status(201).json({ message: 'Sous catégorie ajoutée', id: result.insertId });
    } catch (error) {
      console.error('Erreur ajout sous_categories:', error);
      res.status(500).json({ error: "Erreur lors de l'ajout" });
    }
  });
}