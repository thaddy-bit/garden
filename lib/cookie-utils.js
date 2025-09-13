import cookie from 'cookie';

/**
 * Configuration uniforme des cookies pour l'authentification
 */
export const createAuthCookie = (token, options = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return cookie.serialize('client_token', token, {
    httpOnly: true,
    secure: isProduction, // HTTPS requis en production
    sameSite: 'lax', // Compatible avec les redirections
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    ...options // Permet de surcharger les options si nécessaire
  });
};

/**
 * Configuration pour supprimer un cookie d'authentification
 */
export const clearAuthCookie = () => {
  return cookie.serialize('client_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expire immédiatement
  });
};
