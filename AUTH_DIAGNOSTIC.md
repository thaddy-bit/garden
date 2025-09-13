# Diagnostic d'authentification en production

## Variables d'environnement requises

Assurez-vous que ces variables sont définies en production :

```bash
# Base de données
DB_HOST=votre_host_db
DB_USER=votre_user_db
DB_PASSWORD=votre_password_db
DB_NAME=votre_nom_db
DB_PORT=3306

# JWT Secret (CRITIQUE - doit être identique partout)
JWT_SECRET=votre_clé_secrète_jwt_très_longue_et_complexe

# URL de base pour les appels API côté serveur
NEXT_PUBLIC_BASE_URL=https://gardendakar.com

# Google OAuth (si utilisé)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret

# Environment
NODE_ENV=production
```

## Tests de diagnostic

### 1. Test de l'API de login
```bash
curl -X POST "https://gardendakar.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@garden.com","password":"test123"}' \
  -v
```

### 2. Test de l'API /me avec cookie
```bash
curl -X GET "https://gardendakar.com/api/auth/me" \
  -H "Cookie: client_token=VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json"
```

### 3. Test de l'API panier
```bash
curl -X GET "https://gardendakar.com/api/panier?client_id=8" \
  -H "Cookie: client_token=VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json"
```

## Problèmes courants

1. **JWT_SECRET manquant ou différent** : L'erreur sera "invalid signature"
2. **Cookies bloqués** : Vérifier que le domaine accepte les cookies
3. **HTTPS requis** : En production, les cookies sécurisés nécessitent HTTPS
4. **Base de données inaccessible** : Vérifier les credentials de DB

## Configuration des cookies

Les cookies sont maintenant configurés de manière uniforme :
- **Nom** : `client_token`
- **HttpOnly** : `true` (sécurité)
- **Secure** : `true` en production (HTTPS requis)
- **SameSite** : `lax` (compatibilité)
- **Durée** : 7 jours
