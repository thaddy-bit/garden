import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const client_id = req.query.client_id;

  if (!client_id) {
    return res.status(400).json({ error: "Client requis" });
  }

  try {
    const [result] = await pool.query(
      "SELECT SUM(quantite) as total FROM panier WHERE client_id = ?",
      [client_id]
    );

    res.status(200).json({ total: result[0].total || 0 });
  } catch (error) {
    console.error("Erreur API /panier/count :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
