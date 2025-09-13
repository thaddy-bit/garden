#!/bin/bash

echo "🔧 Configuration Resend pour l'envoi d'emails"
echo "=============================================="
echo ""

echo "📋 Étapes pour configurer Resend :"
echo ""
echo "1. 🌐 Allez sur https://resend.com"
echo "2. 📝 Créez un compte gratuit"
echo "3. 🔑 Récupérez votre clé API (commence par 're_')"
echo "4. ⚙️  Configurez la clé avec une des méthodes ci-dessous :"
echo ""

echo "💡 Méthode 1 - Variable d'environnement temporaire :"
echo "export RESEND_API_KEY=\"re_votre_vraie_cle_api\""
echo ""

echo "💡 Méthode 2 - Variable d'environnement permanente :"
echo "echo 'export RESEND_API_KEY=\"re_votre_vraie_cle_api\"' >> ~/.zshrc"
echo "source ~/.zshrc"
echo ""

echo "💡 Méthode 3 - Fichier .env.local (si accessible) :"
echo "echo 'RESEND_API_KEY=re_votre_vraie_cle_api' >> .env.local"
echo ""

echo "🧪 Test de la configuration :"
echo "npm run dev"
echo "# Puis testez sur http://localhost:3000/forgot-password"
echo ""

echo "📧 Une fois configuré, vous recevrez de vrais emails !"
echo ""

# Vérifier si la clé est déjà configurée
if [ ! -z "$RESEND_API_KEY" ]; then
    echo "✅ RESEND_API_KEY est configurée : $RESEND_API_KEY"
    if [[ $RESEND_API_KEY == re_* ]]; then
        echo "✅ Format de clé valide détecté"
    else
        echo "⚠️  Format de clé invalide (doit commencer par 're_')"
    fi
else
    echo "❌ RESEND_API_KEY n'est pas configurée"
    echo "💡 Utilisez une des méthodes ci-dessus pour la configurer"
fi



