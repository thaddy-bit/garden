// lib/slug.js
// Fonction utilitaire pour générer des slugs cohérents

export function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Remplacer tous les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '');     // Supprimer les tirets en début et fin
}

export function findMarqueBySlug(marques, slug) {
  return marques.find(marque => 
    generateSlug(marque.nom) === slug
  );
}