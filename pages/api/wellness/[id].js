// pages/api/wellness/[id].js
import { pool } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM wellness WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service wellness non trouvé" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur API wellness par ID:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}