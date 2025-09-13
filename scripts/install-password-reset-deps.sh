#!/bin/bash

# Script d'installation des dépendances pour le système de réinitialisation de mot de passe
# Exécutez ce script dans le répertoire racine de votre projet

echo "🔧 Installation des dépendances pour le système de réinitialisation de mot de passe..."

# Installer les dépendances npm nécessaires
npm install resend bcryptjs

echo "✅ Dépendances installées avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Ajoutez vos variables d'environnement dans .env.local :"
echo "   - NEXT_PUBLIC_BASE_URL=http://localhost:3000"
echo "   - RESEND_API_KEY=votre_cle_resend"
echo ""
echo "2. Exécutez le script SQL pour créer la table password_reset_tokens"
echo ""
echo "3. Configurez votre compte Resend pour l'envoi d'emails"
echo ""
echo "4. Testez le système sur /forgot-password"
echo ""
echo "🎉 Système de réinitialisation de mot de passe prêt !"



