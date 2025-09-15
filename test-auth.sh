#!/bin/bash

# Script de test d'authentification avec credentials valides
# Usage: ./test-auth.sh https://gardendakar.com email@example.com password

BASE_URL=${1:-"https://gardendakar.com"}
EMAIL=${2:-"test@garden.com"}
PASSWORD=${3:-"test123"}

echo "🔐 Test d'authentification avec credentials"
echo "=========================================="
echo "URL: $BASE_URL"
echo "Email: $EMAIL"
echo ""

# Test de connexion
echo "1. Tentative de connexion..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
    -w "%{http_code}" \
    -o /tmp/login_response.json)

echo "Code de réponse: $LOGIN_RESPONSE"

if [ "$LOGIN_RESPONSE" = "200" ]; then
    echo "✅ Connexion réussie!"
    
    # Extraire le cookie du header
    COOKIE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
        -D /tmp/login_headers.txt \
        -o /dev/null)
    
    # Chercher le cookie client_token
    CLIENT_TOKEN=$(grep -i "set-cookie.*client_token" /tmp/login_headers.txt | sed 's/.*client_token=\([^;]*\).*/\1/')
    
    if [ -n "$CLIENT_TOKEN" ]; then
        echo "✅ Cookie client_token récupéré"
        
        # Test de l'API /me avec le cookie
        echo "2. Test de l'API /me avec authentification..."
        ME_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/me" \
            -H "Cookie: client_token=$CLIENT_TOKEN" \
            -w "%{http_code}" \
            -o /tmp/me_response.json)
        
        echo "Code de réponse /me: $ME_RESPONSE"
        
        if [ "$ME_RESPONSE" = "200" ]; then
            echo "✅ API /me fonctionne avec authentification"
            echo "Données utilisateur:"
            cat /tmp/me_response.json | jq . 2>/dev/null || cat /tmp/me_response.json
        else
            echo "❌ API /me échoue avec authentification"
            echo "Réponse:"
            cat /tmp/me_response.json
        fi
        
        # Test de l'API panier avec le cookie
        echo "3. Test de l'API panier avec authentification..."
        USER_ID=$(cat /tmp/me_response.json | jq -r '.id' 2>/dev/null || echo "1")
        PANIER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/panier?client_id=$USER_ID" \
            -H "Cookie: client_token=$CLIENT_TOKEN" \
            -w "%{http_code}" \
            -o /tmp/panier_response.json)
        
        echo "Code de réponse panier: $PANIER_RESPONSE"
        
        if [ "$PANIER_RESPONSE" = "200" ]; then
            echo "✅ API panier fonctionne avec authentification"
        else
            echo "❌ API panier échoue avec authentification"
            echo "Réponse:"
            cat /tmp/panier_response.json
        fi
        
    else
        echo "❌ Impossible de récupérer le cookie client_token"
        echo "Headers de réponse:"
        cat /tmp/login_headers.txt
    fi
    
else
    echo "❌ Échec de la connexion"
    echo "Réponse:"
    cat /tmp/login_response.json
fi

# Nettoyage
rm -f /tmp/login_response.json /tmp/login_headers.txt /tmp/me_response.json /tmp/panier_response.json

echo ""
echo "📋 Résumé:"
echo "- Code 200 = Succès"
echo "- Code 401 = Non autorisé (credentials incorrects)"
echo "- Code 500 = Erreur serveur (problème de configuration)"

