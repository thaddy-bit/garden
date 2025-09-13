// import pool from '../../../lib/db';
// import pool from "../../../lib/db";
import { pool } from '@/lib/db';
import jwt from "jsonwebtoken"; // Import de JWT pour la gestion des tokens
import bcrypt from "bcryptjs"; // Import de bcrypt pour comparer les mots de passe
import cookie from "cookie";

export default async function handler(req, res) {
  
  //////////////////////////

  if (req.method !== "POST") return res.status(405).end(); // Vérifie que la requête est un POST

  const { email, password } = req.body; // Récupération des données envoyées par le formulaire

  // Recherche du client dans la base de données
  const [rows] = await pool.query("SELECT * FROM client WHERE email = ?", [email]);
  const client = rows[0]; // Récupérer la première ligne

  if (!client) {
    return res.status(401).json({ message: "Utilisateur non trouvé." }); // Si l'utilisateur n'existe pas
  }

  console.log(client);

  // Vérification du mot de passe
  const validPassword = await bcrypt.compare(password, client.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Mot de passe incorrectttttt." }); // Si le mot de passe est incorrect
  }

  // Création du token JWT
  /*
  const token = jwt.sign(
    { id: client.id, email: client.email }, // Payload du token
    process.env.JWT_SECRET, // Clé secrète stockée dans les variables d'environnement
    { expiresIn: "1d" } // Durée de validité du token (1 jour)
  );
  */
  const token = jwt.sign({ id: client.id, email: client.email }, process.env.JWT_SECRET, { expiresIn: "7d" });


  // Stocke le token dans un cookie HTTP-only
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("client_token", token, {
      httpOnly: true, // Empêche l'accès en JS (protège contre XSS)
      secure: process.env.NODE_ENV === "production", // Activer HTTPS en production
      sameSite: "lax", // Changé de "Strict" à "lax" pour compatibilité
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // Expiration en 7 jours (comme Google auth)
    })
  );

  // Définir le cookie
/*
  res.setHeader("Set-Cookie", cookie.serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  }));
  */
  // res.setHeader("Set-Cookie", serialize("token", token, { httpOnly: true, path: "/" }));
  return res.status(200).json({ message: "Connexion réussie" });
}

////////////////////////

/*
import db from "../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM client WHERE email = ?", [email]);

    let user;
    if (rows.length > 0) {
      user = rows[0];

      // Vérifier le mot de passe
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }
    } else {
      // Hacher le mot de passe et créer un nouveau client
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query("INSERT INTO client (email, password) VALUES (?, ?)", [email, hashedPassword]);

      user = { id: result.insertId, email };
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Définir le cookie
    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }));

    res.status(200).json({ message: "Connexion réussie", user });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}
*/