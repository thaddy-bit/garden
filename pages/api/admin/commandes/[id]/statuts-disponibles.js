import { pool } from "@/lib/db";
import { getAvailableStatuses, STATUS_CONFIG } from "@/lib/statusWorkflow";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const connection = await pool.getConnection();

  try {
    const { id: commande_id } = req.query;

    if (!commande_id) {
      return res.status(400).json({ error: "ID de commande requis" });
    }

    // Récupérer le statut actuel de la commande
    const [commande] = await connection.query(
      `SELECT id, statut, numero_commande FROM commandes WHERE id = ?`,
      [commande_id]
    );

    if (commande.length === 0) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    const statutActuel = commande[0].statut;
    const statutsDisponibles = getAvailableStatuses(statutActuel);

    // Enrichir les statuts avec leurs configurations
    const statutsAvecConfig = statutsDisponibles.map(statut => ({
      value: statut,
      ...STATUS_CONFIG[statut]
    }));

    res.status(200).json({
      commande_id: parseInt(commande_id),
      numero_commande: commande[0].numero_commande,
      statut_actuel: statutActuel,
      statuts_disponibles: statutsAvecConfig
    });

  } catch (error) {
    console.error("Erreur récupération statuts disponibles:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des statuts disponibles." });
  } finally {
    connection.release();
  }
}
