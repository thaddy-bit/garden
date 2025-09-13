// utils/statusWorkflow.js

/**
 * Définit les transitions autorisées entre les statuts de commande
 */
export const STATUS_WORKFLOW = {
  'en_attente': ['confirmee', 'annulee'],
  'confirmee': ['en_preparation', 'annulee'],
  'en_preparation': ['prete', 'annulee'],
  'prete': ['en_livraison', 'annulee'],
  'en_livraison': ['livree', 'annulee'],
  'livree': ['retournee'], // Une fois livrée, on peut seulement la retourner
  'annulee': [], // Une fois annulée, pas de changement possible
  'retournee': ['annulee'], // Un retour peut être annulé
  'refusee': [] // Une fois refusée, pas de changement possible
};

/**
 * Vérifie si une transition de statut est autorisée
 * @param {string} currentStatus - Statut actuel
 * @param {string} newStatus - Nouveau statut souhaité
 * @returns {boolean} - True si la transition est autorisée
 */
export const isStatusTransitionAllowed = (currentStatus, newStatus) => {
  if (!STATUS_WORKFLOW[currentStatus]) {
    return false;
  }
  return STATUS_WORKFLOW[currentStatus].includes(newStatus);
};

/**
 * Retourne les statuts possibles depuis un statut donné
 * @param {string} currentStatus - Statut actuel
 * @returns {Array} - Liste des statuts possibles
 */
export const getAvailableStatuses = (currentStatus) => {
  return STATUS_WORKFLOW[currentStatus] || [];
};

/**
 * Génère un numéro de suivi unique
 * @returns {string} - Numéro de suivi généré
 */
export const generateTrackingNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = String(Date.now()).slice(-6);
  
  return `TRK-${year}${month}${day}-${timestamp}`;
};

/**
 * Détermine l'étape actuelle basée sur le statut
 * @param {string} status - Statut de la commande
 * @returns {string} - Étape correspondante
 */
export const getStepFromStatus = (status) => {
  const stepMapping = {
    'en_attente': 'validation',
    'confirmee': 'preparation',
    'en_preparation': 'preparation',
    'prete': 'emballage',
    'en_livraison': 'expedition',
    'livree': 'finalisee',
    'annulee': 'validation',
    'retournee': 'validation',
    'refusee': 'validation'
  };
  
  return stepMapping[status] || 'validation';
};

/**
 * Détermine si un numéro de suivi doit être généré pour ce statut
 * @param {string} status - Nouveau statut
 * @returns {boolean} - True si un numéro de suivi doit être généré
 */
export const shouldGenerateTrackingNumber = (status) => {
  return ['en_livraison', 'livree'].includes(status);
};

/**
 * Détermine si des informations de transporteur sont requises
 * @param {string} status - Nouveau statut
 * @returns {boolean} - True si le transporteur est requis
 */
export const isCarrierRequired = (status) => {
  return ['en_livraison', 'livree'].includes(status);
};

/**
 * Configuration des statuts avec leurs propriétés
 */
export const STATUS_CONFIG = {
  'en_attente': {
    label: 'En attente',
    color: 'yellow',
    icon: 'Clock',
    description: 'Commande en attente de confirmation'
  },
  'confirmee': {
    label: 'Confirmée',
    color: 'blue',
    icon: 'CheckCircle',
    description: 'Commande confirmée et en cours de préparation'
  },
  'en_preparation': {
    label: 'En préparation',
    color: 'orange',
    icon: 'Package',
    description: 'Commande en cours de préparation'
  },
  'prete': {
    label: 'Prête',
    color: 'purple',
    icon: 'CheckCircle',
    description: 'Commande prête à être expédiée'
  },
  'en_livraison': {
    label: 'En livraison',
    color: 'indigo',
    icon: 'Truck',
    description: 'Commande en cours de livraison'
  },
  'livree': {
    label: 'Livrée',
    color: 'green',
    icon: 'CheckCircle',
    description: 'Commande livrée avec succès'
  },
  'annulee': {
    label: 'Annulée',
    color: 'red',
    icon: 'XCircle',
    description: 'Commande annulée'
  },
  'retournee': {
    label: 'Retournée',
    color: 'gray',
    icon: 'AlertCircle',
    description: 'Commande retournée'
  },
  'refusee': {
    label: 'Refusée',
    color: 'red',
    icon: 'XCircle',
    description: 'Commande refusée'
  }
};
