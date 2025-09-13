# 🔐 Système de Réinitialisation de Mot de Passe

Système complet et sécurisé pour la réinitialisation de mot de passe avec design 3-couleurs (vert/gris/blanc).

## ✨ Fonctionnalités

- **Sécurité renforcée** : Tokens à usage unique, expiration courte, rate limiting
- **Design cohérent** : Palette 3-couleurs (vert #16a34a, gris, blanc)
- **Emails professionnels** : Templates HTML avec Resend
- **Validation robuste** : Côté client et serveur
- **Audit complet** : Logs et tracking des tentatives

## 🚀 Installation

### 1. Base de données
```sql
-- Exécuter le script SQL
source scripts/create-password-reset-table.sql
```

### 2. Dépendances
```bash
# Installer les dépendances
npm install resend bcryptjs

# Ou utiliser le script
chmod +x scripts/install-password-reset-deps.sh
./scripts/install-password-reset-deps.sh
```

### 3. Variables d'environnement
Ajouter à `.env.local` :
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@garden.com
```

### 4. Configuration Resend
1. Créer un compte sur [Resend](https://resend.com)
2. Obtenir votre clé API
3. Configurer votre domaine d'envoi

## 📁 Structure des fichiers

```
pages/
├── forgot-password.js          # Page de demande
├── reset-password.js           # Page de réinitialisation
└── api/auth/
    ├── forgot-password.js      # API demande
    ├── reset-password.js       # API réinitialisation
    └── validate-reset-token.js # API validation

scripts/
├── create-password-reset-table.sql
├── install-password-reset-deps.sh
└── cleanup-expired-tokens.js
```

## 🔒 Sécurité

### Tokens
- **Génération** : `crypto.randomBytes(32).toString('hex')`
- **Stockage** : Hash SHA-256 en base
- **Expiration** : 30 minutes
- **Usage** : Unique (invalidé après utilisation)

### Rate Limiting
- **Limite** : 3 demandes/heure par IP
- **Scope** : IP + email combinés
- **Window** : 1 heure glissante

### Validation
- **Email** : Format RFC valide
- **Mot de passe** : Min 8 caractères, majuscule, minuscule, chiffre
- **Confirmation** : Correspondance exacte

## 🎨 Design

### Palette de couleurs
- **Primaire** : `#16a34a` (green-600)
- **Secondaire** : `#374151` (gray-700)
- **Neutre** : `#ffffff` (white)

### Composants
- **Boutons** : Vert avec hover plus foncé
- **Inputs** : Focus vert, bordures grises
- **Messages** : Toast notifications
- **États** : Loading, success, error

## 📧 Email Template

Template HTML responsive avec :
- Header Garden avec logo
- Message personnalisé
- Bouton CTA vert
- Informations de sécurité
- Footer professionnel

## 🔄 Flux utilisateur

1. **Demande** (`/forgot-password`)
   - Saisie email
   - Validation côté client
   - Envoi API
   - Message générique (sécurité)

2. **Email**
   - Lien unique avec token
   - Expiration 30 minutes
   - Design professionnel

3. **Réinitialisation** (`/reset-password`)
   - Validation token
   - Saisie nouveau mot de passe
   - Confirmation
   - Mise à jour sécurisée

4. **Succès**
   - Confirmation
   - Redirection vers login
   - Invalidation sessions

## 🛠 Maintenance

### Nettoyage automatique
```bash
# Script de nettoyage des tokens expirés
node scripts/cleanup-expired-tokens.js
```

### Cron job (recommandé)
```bash
# Ajouter à crontab pour nettoyage quotidien
0 2 * * * cd /path/to/project && node scripts/cleanup-expired-tokens.js
```

## 🧪 Tests

### Scénarios à tester
- [ ] Flux complet nominal
- [ ] Email inexistant (message générique)
- [ ] Token expiré
- [ ] Token déjà utilisé
- [ ] Rate limiting
- [ ] Validation mot de passe
- [ ] Envoi email (succès/échec)

### URLs de test
- `http://localhost:3000/forgot-password`
- `http://localhost:3000/reset-password?token=test`

## 📊 Monitoring

### Logs importants
- Tentatives de reset (succès/échec)
- Tokens générés/utilisés
- Erreurs d'envoi email
- Tentatives de rate limiting

### Métriques
- Nombre de demandes/jour
- Taux de succès
- Temps de réponse API
- Erreurs email

## 🔧 Personnalisation

### Durée d'expiration
```javascript
// Dans forgot-password.js
const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
```

### Rate limiting
```javascript
// Dans forgot-password.js
const MAX_REQUESTS_PER_HOUR = 3; // Modifiable
```

### Template email
Modifier le HTML dans `forgot-password.js` ligne ~80

## 🚨 Dépannage

### Problèmes courants
1. **Email non reçu** : Vérifier clé Resend, domaine configuré
2. **Token invalide** : Vérifier expiration, nettoyage base
3. **Rate limit** : Attendre 1 heure ou nettoyer cache
4. **Erreur base** : Vérifier connexion, structure table

### Debug
```javascript
// Activer logs détaillés
console.log('Token généré:', token);
console.log('Email envoyé à:', email);
```

## 📈 Évolutions futures

- [ ] Intégration SMS (2FA)
- [ ] Questions de sécurité
- [ ] Historique des mots de passe
- [ ] Notifications push
- [ ] Analytics avancées

---

**🎉 Système prêt à l'emploi !** 

Pour toute question ou amélioration, consultez la documentation ou contactez l'équipe de développement.



