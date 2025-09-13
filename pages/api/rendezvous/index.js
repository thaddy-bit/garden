import { pool } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { date, agent_id, heure, wellness_id, nom, telephone } = req.body;
  if (!date || !agent_id || !heure) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const conn = await pool.getConnection();

    // Vérifier le nombre de réservations de cet agent pour ce jour
    const [existing] = await conn.query(
      "SELECT COUNT(*) AS total FROM rdv WHERE agent_id = ? AND date = ?",
      [agent_id, date]
    );

    if (existing[0].total >= 2) {
      conn.release();
      return res.status(400).json({ message: "Cet agent est déjà complet pour ce jour-là." });
    }

    // Insérer le rendez-vous
    await conn.query(
      `INSERT INTO rdv (nom, Telephone, agent_id, date, heure, wellness_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, telephone, agent_id, date, heure, wellness_id]
    );

    conn.release();
    return res.status(200).json({ message: "Rendez-vous enregistré avec succès." });

  } catch (err) {
    console.error("Erreur API /rendezvous :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}