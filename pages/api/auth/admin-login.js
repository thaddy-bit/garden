import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, role, status FROM users WHERE LOWER(email) = ? ORDER BY updated_at DESC, id DESC LIMIT 1',
      [normalizedEmail]
    );
    const user = rows?.[0];
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
    if (user.status === 'suspended') return res.status(403).json({ message: 'Compte suspendu' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Identifiants invalides' });

    if (user.role !== 'admin' && user.role !== 'superadmin') return res.status(403).json({ message: 'Accès refusé' });

    const token = jwt.sign({ id: user.id, role: user.role, scope: 'admin' }, JWT_SECRET, { expiresIn: '1d' });

    res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    }));

    return res.status(200).json({ message: 'Connexion admin réussie' });
  } catch (error) {
    console.error('admin-login error:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}


