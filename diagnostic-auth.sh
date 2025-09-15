#!/bin/bash

# Script de diagnostic pour l'authentification en production
# Usage: ./diagnostic-auth.sh https://gardendakar.com

BASE_URL=${1:-"https://gardendakar.com"}
echo "🔍 Diagnostic d'authentification pour: $BASE_URL"
echo "=================================================="

# Test 1: Vérifier que le site répond
echo "1. Test de connectivité..."
if curl -s --head "$BASE_URL" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Site accessible"
else
    echo "❌ Site inaccessible"
    exit 1
fi

# Test 2: Vérifier l'API de login (sans credentials)
echo "2. Test de l'API de login..."
LOGIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrongpassword"}')

if [ "$LOGIN_RESPONSE" = "401" ]; then
    echo "✅ API de login répond correctement (401 Unauthorized)"
elif [ "$LOGIN_RESPONSE" = "405" ]; then
    echo "⚠️  API de login répond mais méthode non autorisée"
else
    echo "❌ API de login ne répond pas correctement (Code: $LOGIN_RESPONSE)"
fi

# Test 3: Vérifier l'API /me sans authentification
echo "3. Test de l'API /me sans authentification..."
ME_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/auth/me")
if [ "$ME_RESPONSE" = "401" ]; then
    echo "✅ API /me protège correctement (401 Unauthorized)"
else
    echo "❌ API /me ne protège pas correctement (Code: $ME_RESPONSE)"
fi

# Test 4: Vérifier l'API de panier sans authentification
echo "4. Test de l'API panier sans authentification..."
PANIER_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/panier?client_id=1")
if [ "$PANIER_RESPONSE" = "401" ]; then
    echo "✅ API panier protège correctement (401 Unauthorized)"
else
    echo "❌ API panier ne protège pas correctement (Code: $PANIER_RESPONSE)"
fi

# Test 5: Vérifier les variables d'environnement (si possible)
echo "5. Test des variables d'environnement..."
ENV_TEST=$(curl -s "$BASE_URL/api/hello" 2>/dev/null)
if [ -n "$ENV_TEST" ]; then
    echo "✅ API de test accessible"
else
    echo "⚠️  Impossible de tester les variables d'environnement"
fi

echo ""
echo "📋 Résumé du diagnostic:"
echo "- Si toutes les APIs retournent 401 sans authentification, c'est bon signe"
echo "- Si certaines APIs retournent 500, il y a un problème de configuration"
echo "- Si le site ne répond pas, vérifiez la configuration du serveur"
echo ""
echo "🔧 Prochaines étapes:"
echo "1. Vérifiez les variables d'environnement en production"
echo "2. Vérifiez les logs du serveur pour les erreurs"
echo "3. Testez avec des credentials valides"

