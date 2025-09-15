import { clearAuthCookie } from "@/lib/cookie-utils";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", clearAuthCookie());
  res.status(200).json({ message: "Déconnexion réussie" });
}
