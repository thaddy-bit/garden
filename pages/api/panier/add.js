import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { produit_id, quantite = 1 } = req.body;

  // Validation des données
  if (!produit_id) {
    return res.status(400).json({ error: "ID du produit requis" });
  }

  if (quantite < 1) {
    return res.status(400).json({ error: "La quantité doit être supérieure à 0" });
  }

  const connection = await pool.getConnection();

  try {
    // Vérifier que le produit existe et est actif
    const [produits] = await connection.execute(
      "SELECT id, nom, prix, stock FROM produits WHERE id = ? AND actif = 1",
      [produit_id]
    );

    if (produits.length === 0) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    const produit = produits[0];

    // Vérifier le stock disponible
    if (produit.stock < quantite) {
      return res.status(400).json({ 
        error: `Stock insuffisant. Disponible: ${produit.stock}` 
      });
    }

    // Récupérer le token depuis les cookies pour vérifier l'authentification
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.client_token;

    if (!token) {
      return res.status(401).json({ error: "Vous devez être connecté pour ajouter des produits au panier" });
    }

    let client_id;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      client_id = decoded.id;
    } catch (error) {
      return res.status(401).json({ error: "Token invalide. Veuillez vous reconnecter" });
    }

    // Vérifier si le produit est déjà dans le panier
    const [panierExistants] = await connection.execute(
      "SELECT id, quantite FROM panier WHERE client_id = ? AND produit_id = ?",
      [client_id, produit_id]
    );

    if (panierExistants.length > 0) {
      // Mettre à jour la quantité
      const nouvelleQuantite = panierExistants[0].quantite + quantite;
      
      // Vérifier le stock total
      if (produit.stock < nouvelleQuantite) {
        return res.status(400).json({ 
          error: `Stock insuffisant. Disponible: ${produit.stock}, demandé: ${nouvelleQuantite}` 
        });
      }

      await connection.execute(
        "UPDATE panier SET quantite = ? WHERE id = ?",
        [nouvelleQuantite, panierExistants[0].id]
      );

      res.status(200).json({ 
        message: "Quantité mise à jour dans le panier",
        quantite: nouvelleQuantite,
        produit: {
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix
        }
      });
    } else {
      // Ajouter le produit au panier
      await connection.execute(
        `INSERT INTO panier (client_id, produit_id, quantite) 
         VALUES (?, ?, ?)`,
        [client_id, produit_id, quantite]
      );

      res.status(201).json({ 
        message: "Produit ajouté au panier",
        quantite: quantite,
        produit: {
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix
        }
      });
    }

  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  } finally {
    connection.release();
  }
}
