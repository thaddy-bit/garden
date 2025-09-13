# Analyse du fichier base.sql - Schéma de base de données

## Vue d'ensemble
Le fichier `base.sql` contient le schéma complet d'une base de données e-commerce avec des fonctionnalités de wellness/spa. La base de données utilise MySQL/MariaDB avec le charset `utf8mb4`.

## Tables principales

### 1. Gestion des utilisateurs
- **`client`** : Clients du site e-commerce
- **`users`** : Utilisateurs administrateurs
- **`operateur`** : Opérateurs/employés
- **`agents`** : Agents de wellness (masseuses, coiffeuses)

### 2. Catalogue produits
- **`marques`** : Marques de produits (Nike, Adidas, Zara, etc.)
- **`catégorie`** : Catégories principales (NOMADE, LINGUERE, AMAZONE, etc.)
- **`sous_categories`** : Sous-catégories de produits
- **`collections`** : Collections de produits
- **`produits`** : Produits principaux
- **`produit_variantes`** : Variantes de produits (couleur, taille, etc.)
- **`produit_images`** : Images des produits
- **`attributs`** : Attributs des produits (couleur, taille, matière, style)
- **`variante_attributs`** : Liaison entre variantes et attributs

### 3. E-commerce
- **`panier`** : Panier d'achat des clients
- **`commandes`** : Commandes passées
- **`commande_details`** : Détails des commandes
- **`favoris`** : Produits favoris des clients
- **`likes`** : Likes des produits

### 4. Paiements
- **`modes_paiement`** : Modes de paiement disponibles
- **`paiements`** : Historique des paiements

### 5. Wellness/Spa
- **`wellness`** : Services de wellness
- **`rdv`** : Rendez-vous de wellness

### 6. Configuration
- **`zone`** : Zones géographiques

## Relations principales

### Relations produits
- `produits` → `marques` (marque_id)
- `produits` → `sous_categories` (sous_categorie_id)
- `produits` → `collections` (collection_id)
- `produit_variantes` → `produits` (produit_id)
- `produit_images` → `produits` (produit_id)
- `variante_attributs` → `produit_variantes` (variante_id)
- `variante_attributs` → `attributs` (attribut_id)

### Relations e-commerce
- `panier` → `client` (client_id)
- `panier` → `produits` (produit_id)
- `commandes` → `client` (client_id)
- `commandes` → `operateur` (operateur_id)
- `commandes` → `modes_paiement` (mode_paiement_id)
- `commande_details` → `commandes` (commande_id)
- `commande_details` → `produits` (produit_id)
- `favoris` → `client` (client_id)
- `favoris` → `produits` (produit_id)
- `likes` → `client` (client_id)
- `likes` → `produits` (produit_id)

### Relations paiements
- `paiements` → `client` (client_id)
- `paiements` → `modes_paiement` (mode_paiement_id)
- `paiements` → `operateur` (operateur_id)

### Relations wellness
- `rdv` → `agents` (agent_id)

## Caractéristiques techniques

### Charset et Collation
- Charset principal : `utf8mb4`
- Collation : `utf8mb4_unicode_ci` ou `utf8mb4_general_ci`

### Moteur de stockage
- InnoDB pour toutes les tables

### Contraintes
- Clés étrangères avec CASCADE et SET NULL
- Index sur les clés primaires
- Contraintes d'unicité sur certains champs

## Données d'exemple
Le fichier contient des données d'exemple pour :
- 5 agents de wellness
- 10+ attributs de produits (couleurs, tailles, matières)
- 11 catégories/marques (NOMADE, LINGUERE, AMAZONE, etc.)
- 5 marques internationales (Nike, Adidas, Zara, H&M, Uniqlo)
- Plusieurs produits avec variantes
- 1 client de test
- Données de panier et commandes

## Points d'attention
1. **Gestion des variantes** : Système complexe avec attributs et variantes
2. **Multi-marques** : Support de marques internationales et locales
3. **Wellness intégré** : Système de rendez-vous avec agents spécialisés
4. **Gestion des paiements** : Système complet avec modes de paiement multiples
5. **Traçabilité** : Champs created_by/updated_by pour l'audit
6. **Internationalisation** : Support des caractères spéciaux avec utf8mb4
