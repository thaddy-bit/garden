-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 11, 2025 at 12:00 PM
-- Server version: 10.11.10-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u729893412_garden`
--

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `téléphone` varchar(20) DEFAULT NULL,
  `métier` enum('masseuse','coiffeuse') NOT NULL,
  `photo_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`id`, `nom`, `email`, `téléphone`, `métier`, `photo_url`, `created_at`) VALUES
(1, 'Kadia Traoré', 'kadia@tictac-cg.com', '0700000001', 'coiffeuse', 'https://via.placeholder.com/150?text=Kadia', '2025-04-29 13:59:30'),
(2, 'Fatou Diallo', 'fatou@tictac-cg.com', '0700000002', 'masseuse', 'https://via.placeholder.com/150?text=Fatou', '2025-04-29 13:59:30'),
(3, 'Awa Koné', 'awa@tictac-cg.com', '0700000003', 'masseuse', 'https://via.placeholder.com/150?text=Awa', '2025-04-29 13:59:30'),
(4, 'Mariam Cissé', 'mariam@tictac-cg.com', '0700000004', 'masseuse', 'https://via.placeholder.com/150?text=Mariam', '2025-04-29 13:59:30'),
(5, 'Sali Keita', 'sali@tictac-cg.com', '0700000005', 'coiffeuse', 'https://via.placeholder.com/150?text=Sali', '2025-04-29 13:59:30');

-- --------------------------------------------------------

--
-- Table structure for table `ajustements_stock`
--

CREATE TABLE `ajustements_stock` (
  `id` int(11) NOT NULL,
  `numero_ajustement` varchar(50) NOT NULL,
  `entrepot_id` int(11) DEFAULT NULL,
  `operateur_id` int(11) DEFAULT NULL COMMENT 'FK operateur si pertinent',
  `date_ajustement` datetime NOT NULL DEFAULT current_timestamp(),
  `motif` varchar(255) DEFAULT NULL,
  `statut` enum('brouillon','valide') NOT NULL DEFAULT 'brouillon',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ajustements de stock (en-têtes)';

-- --------------------------------------------------------

--
-- Table structure for table `ajustements_stock_details`
--

CREATE TABLE `ajustements_stock_details` (
  `id` int(11) NOT NULL,
  `ajustement_id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `quantite` int(11) NOT NULL COMMENT '+/-',
  `commentaire` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ajustements de stock (lignes)';

-- --------------------------------------------------------

--
-- Table structure for table `attributs`
--

CREATE TABLE `attributs` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `type` enum('couleur','taille','materiau','style') NOT NULL,
  `valeur` varchar(100) NOT NULL,
  `code_couleur` varchar(7) DEFAULT NULL,
  `ordre` int(11) DEFAULT 0,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attributs`
--

INSERT INTO `attributs` (`id`, `nom`, `type`, `valeur`, `code_couleur`, `ordre`, `actif`, `created_at`) VALUES
(1, 'Couleur', 'couleur', 'Noir', '#000000', 1, 1, '2025-09-06 00:35:49'),
(2, 'Couleur', 'couleur', 'Blanc', '#FFFFFF', 2, 1, '2025-09-06 00:35:49'),
(3, 'Couleur', 'couleur', 'Rouge', '#FF0000', 3, 1, '2025-09-06 00:35:49'),
(4, 'Couleur', 'couleur', 'Bleu', '#0000FF', 4, 1, '2025-09-06 00:35:49'),
(5, 'Couleur', 'couleur', 'Vert', '#00FF00', 5, 1, '2025-09-06 00:35:49'),
(6, 'Couleur', 'couleur', 'Gris', '#808080', 6, 1, '2025-09-06 00:35:49'),
(7, 'Couleur', 'couleur', 'Rose', '#FFC0CB', 7, 1, '2025-09-06 00:35:49'),
(8, 'Couleur', 'couleur', 'Violet', '#800080', 8, 1, '2025-09-06 00:35:49'),
(9, 'Couleur', 'couleur', 'Orange', '#FFA500', 9, 1, '2025-09-06 00:35:49'),
(10, 'Couleur', 'couleur', 'Jaune', '#FFFF00', 10, 1, '2025-09-06 00:35:49'),
(11, 'Taille', 'taille', 'XS', NULL, 1, 1, '2025-09-06 00:35:49'),
(12, 'Taille', 'taille', 'S', NULL, 2, 1, '2025-09-06 00:35:49'),
(13, 'Taille', 'taille', 'M', NULL, 3, 1, '2025-09-06 00:35:49'),
(14, 'Taille', 'taille', 'L', NULL, 4, 1, '2025-09-06 00:35:49'),
(15, 'Taille', 'taille', 'XL', NULL, 5, 1, '2025-09-06 00:35:49'),
(16, 'Taille', 'taille', 'XXL', NULL, 6, 1, '2025-09-06 00:35:49'),
(17, 'Taille', 'taille', '36', NULL, 7, 1, '2025-09-06 00:35:49'),
(18, 'Taille', 'taille', '37', NULL, 8, 1, '2025-09-06 00:35:49'),
(19, 'Taille', 'taille', '38', NULL, 9, 1, '2025-09-06 00:35:49'),
(20, 'Taille', 'taille', '39', NULL, 10, 1, '2025-09-06 00:35:49'),
(21, 'Taille', 'taille', '40', NULL, 11, 1, '2025-09-06 00:35:49'),
(22, 'Taille', 'taille', '41', NULL, 12, 1, '2025-09-06 00:35:49'),
(23, 'Taille', 'taille', '42', NULL, 13, 1, '2025-09-06 00:35:49'),
(24, 'Taille', 'taille', '43', NULL, 14, 1, '2025-09-06 00:35:49'),
(25, 'Taille', 'taille', '44', NULL, 15, 1, '2025-09-06 00:35:49'),
(26, 'Taille', 'taille', '45', NULL, 16, 1, '2025-09-06 00:35:49'),
(27, 'Matière', 'materiau', 'Coton', NULL, 1, 1, '2025-09-06 00:35:49'),
(28, 'Matière', 'materiau', 'Polyester', NULL, 2, 1, '2025-09-06 00:35:49'),
(29, 'Matière', 'materiau', 'Cuir', NULL, 3, 1, '2025-09-06 00:35:49'),
(30, 'Matière', 'materiau', 'Daim', NULL, 4, 1, '2025-09-06 00:35:49'),
(31, 'Matière', 'materiau', 'Nylon', NULL, 5, 1, '2025-09-06 00:35:49'),
(32, 'Matière', 'materiau', 'Laine', NULL, 6, 1, '2025-09-06 00:35:49'),
(33, 'Matière', 'materiau', 'Soie', NULL, 7, 1, '2025-09-06 00:35:49'),
(34, 'Matière', 'materiau', 'Denim', NULL, 8, 1, '2025-09-06 00:35:49'),
(69, 'Couleur', 'couleur', 'Noir/Blanc', NULL, 999, 1, '2025-09-06 00:38:44'),
(70, 'Couleur', 'couleur', 'Gris/Rose', NULL, 999, 1, '2025-09-06 00:38:46'),
(71, 'Couleur', 'couleur', 'Blanc/Rouge', NULL, 999, 1, '2025-09-06 00:38:48'),
(72, 'Couleur', 'couleur', 'Bleu/Orange', NULL, 999, 1, '2025-09-06 00:38:49'),
(73, 'Couleur', 'couleur', 'Transparent', NULL, 999, 1, '2025-09-06 00:39:03'),
(74, 'Couleur', 'couleur', 'Blanc/Noir', NULL, 999, 1, '2025-09-06 00:39:05'),
(75, 'Couleur', 'couleur', 'Blanc/Vert', NULL, 999, 1, '2025-09-06 00:39:06'),
(76, 'Couleur', 'couleur', 'Gris/Rouge', NULL, 999, 1, '2025-09-06 00:39:07'),
(77, 'Couleur', 'couleur', 'Orange/Noir', NULL, 999, 1, '2025-09-06 00:39:09'),
(78, 'Couleur', 'couleur', 'Beige', NULL, 999, 1, '2025-09-06 00:39:26'),
(79, 'Taille', 'taille', '6 ans', NULL, 999, 1, '2025-09-06 00:39:35'),
(80, 'Taille', 'taille', '8 ans', NULL, 999, 1, '2025-09-06 00:39:36'),
(81, 'Taille', 'taille', '10 ans', NULL, 999, 1, '2025-09-06 00:39:37'),
(82, 'Couleur', 'couleur', 'Doré', NULL, 999, 1, '2025-09-06 00:39:40'),
(83, 'Couleur', 'couleur', 'Marron', NULL, 999, 1, '2025-09-06 00:39:41');

-- --------------------------------------------------------

--
-- Table structure for table `auth_login_logs`
--

CREATE TABLE `auth_login_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catégorie`
--

CREATE TABLE `catégorie` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `zone` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `catégorie`
--

INSERT INTO `catégorie` (`id`, `nom`, `description`, `image_url`, `zone`, `created_at`, `updated_at`) VALUES
(1, 'NOMADE', 'Le nomadisme est comme une fleur sauvage qui se laisse porter par le vent, embrassant la beauté de chaque horizon changeant ; Il est par conséquent un\r\nmode de vie fondé sur le déplacement.', '/uploads/marques/1745862530593.jpg', '', '2025-04-28 17:48:55', '2025-04-28 17:48:55'),
(2, 'LINGUERE', 'Venant de la langue wolof principalement parlée au Sénégal;\r\n\"La Linguère\" fait référence à une figure féminine puissante et influente,\r\nsouvent une reine ou un noble. \"Linguère\" était le titre donné à la\r\nmère ou à la sœur du souverain dans l\'ancien Sénégal.', '/uploads/marques/1745862648849.jpg', '', '2025-04-28 17:50:53', '2025-04-28 17:50:53'),
(3, 'AMAZONE', 'Dans la mythologie grecque, les femmes Amazones sont des femmes guerrières, dont la reine était Hippolytè, elles étaient des femmes qui étaient considérées égales aux hommes, aussi qualifiées au combat que les hommes, étant représentées comme de belles et\r\nvaillantes guerrières.', '/uploads/marques/1745862717991.jpg', '', '2025-04-28 17:52:02', '2025-04-28 17:52:02'),
(4, 'JAMBAAR', 'Jambaar est un terme d\'origine sénégalaise qui désigne traditionnellement un guerrier ou un combattant.\r\nLe mot \"Jambaar\" est dérivé du mot wolof \"Jamba\" qui signifie \"guerre\" ou \"bataille\". Les Jambaars étaient des hommes volontaires qui se portaient volontaires pour défendre leur communauté ou leur territoire contre les menaces extérieures. Ils étaient connus pour leur courage, leur force et leur détermination.', '/uploads/marques/1745862814099.jpg', '', '2025-04-28 17:53:39', '2025-04-28 17:53:39'),
(5, 'NUBIAN', 'Venant du sud de l’Egypte, les nubiens sont un peuple fière, honnête et durable, ayant sa propre culture et ses propres costumes, leurs cultures comprends une variété de style d’art, les peintures, décorations, poteries et objets artisanaux fascinants tel que des colliers et des paniers\r\ntressés.', '/uploads/marques/1745862881693.jpg', '', '2025-04-28 17:54:46', '2025-04-28 17:54:46'),
(6, 'NIL', 'Le Nil est l’un des fleuve le plus grand du monde et traverse le Soudan, la Tanzanie, l’Ouganda, le Rwanda, le Burundi et l’Égypte et se jette dans la Méditerranée en formant un delta au nord de l\'Égypte.', '/uploads/marques/1745862924939.jpg', '', '2025-04-28 17:55:29', '2025-04-28 17:55:29'),
(7, 'SAHARA', 'Le Sahara est la plus grande région désertique chaude du monde, située principalement en Afrique du Nord.\r\nAu cours des derniers millions d\'années, le Sahara a subi une série de cycles climatiques, passant de périodes plus humides à des périodes plus sèches.', '/uploads/marques/1745862983169.jpg', '', '2025-04-28 17:56:28', '2025-04-28 17:56:28'),
(8, 'ASHANTI', 'Les Ashanti sont à la fois une ethnie et un royaume qui se trouvent dans la partie centrale du Ghana, en Afrique de l\'Ouest. Ils constituent l\'un des plus grands groupes ethniques du pays et ont une riche histoire\r\net une culture distincte.', '/uploads/marques/1745863038736.jpg', '', '2025-04-28 17:57:23', '2025-04-28 17:57:23'),
(9, 'ZULU', 'Les Zulu, appelés aussi \"peuple du ciel\", sont un peuple Bantou d\'Afrique australe, ce sont des agriculteurs et des éleveurs, qui maitrisent la technique du fer.', '/uploads/marques/1745863089159.jpg', '', '2025-04-28 17:58:14', '2025-04-28 17:58:14'),
(10, 'MASSAÏ', 'Les \"Massaïs\" sont un groupe ethnique semi-nomade vivant principalement dans des régions de l\'Afrique de l\'Est, en\r\nparticulier au Kenya et en Tanzanie.', '/uploads/marques/1745863139534.jpg', '', '2025-04-28 17:59:04', '2025-04-28 17:59:04'),
(11, 'KYA', 'Dédié à toutes les Dames audacieuses.\r\nContinuez à courir, ne faites jamais semblant, prenez sans blesser ...\r\nCar l\'amour apportera la meilleure lumière pour réussir dans tous les sens que vous choisissez vraiment.\r\nHeureuse de se réveiller et de s\'habiller comme une patronne.\r\nLe monde de demain est a nous', '/uploads/marques/1745863212178.jpg', '', '2025-04-28 18:00:17', '2025-04-28 18:00:17');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `nom`, `prenom`, `telephone`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Rhoddy', 'Thaddy', '065006276', 'bonheurthaddy0@gmail.com', '$2b$12$jeuappmjopuLX9hqigktj.W8/EF2RBLaOrGwfpPIRZeYySV8ILjS2', '2025-04-28 17:23:07', '2025-09-10 22:33:56'),
(2, 'THADDY', 'Noé Emmanuel', '788677875', 'karamouzisfeza@gmail.com', '$2b$10$2jxj50MUKJY98a1dO5kMiOlwfEhQ9bBjxe2gHGd.1jext2lDuw9Na', '2025-09-10 22:43:25', '2025-09-10 22:43:25');

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `nom`, `description`, `image_url`, `date_debut`, `date_fin`, `actif`, `created_at`, `updated_at`) VALUES
(1, 'Collection Sport', 'Collection dédiée aux vêtements et accessoires de sport', '/images/collections/sport.jpg', '2025-01-01', '2025-12-31', 1, '2025-09-05 21:38:16', '2025-09-05 21:38:16'),
(2, 'Collection Lifestyle', 'Collection pour le style de vie urbain et décontracté', '/images/collections/lifestyle.jpg', '2025-01-01', '2025-12-31', 1, '2025-09-05 21:38:16', '2025-09-05 21:38:16'),
(3, 'Collection Premium', 'Collection haut de gamme avec des matériaux premium', '/images/collections/premium.jpg', '2025-01-01', '2025-12-31', 1, '2025-09-05 21:38:16', '2025-09-05 21:38:16'),
(4, 'Collection Été', 'Collection légère et confortable pour l\'été', '/images/collections/ete.jpg', '2025-06-01', '2025-09-30', 1, '2025-09-05 21:38:16', '2025-09-05 21:38:16'),
(5, 'Collection Hiver', 'Collection chaude et protectrice pour l\'hiver', '/images/collections/hiver.jpg', '2025-12-01', '2025-03-31', 1, '2025-09-05 21:38:16', '2025-09-05 21:38:16');

-- --------------------------------------------------------

--
-- Table structure for table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `numero_commande` varchar(50) NOT NULL COMMENT 'Numéro unique de commande (ex: CMD-2025-001)',
  `client_id` int(11) NOT NULL COMMENT 'Client qui a passé la commande',
  `operateur_id` int(11) DEFAULT NULL COMMENT 'Opérateur qui a traité la commande',
  `date_commande` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Date de création de la commande',
  `date_livraison_prevue` datetime DEFAULT NULL COMMENT 'Date de livraison prévue',
  `date_livraison_reelle` datetime DEFAULT NULL COMMENT 'Date de livraison effective',
  `date_annulation` datetime DEFAULT NULL COMMENT 'Date d''annulation si applicable',
  `statut` enum('en_attente','confirmee','en_preparation','prete','en_livraison','livree','annulee','retournee','refusee') NOT NULL DEFAULT 'en_attente' COMMENT 'Statut actuel de la commande',
  `etape_actuelle` enum('validation','preparation','emballage','expedition','livraison','finalisee') DEFAULT 'validation' COMMENT 'Étape actuelle du processus',
  `montant_sous_total` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Montant des produits (sans frais)',
  `frais_livraison` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Frais de livraison',
  `frais_service` decimal(10,2) DEFAULT 0.00 COMMENT 'Frais de service additionnels',
  `remise` decimal(10,2) DEFAULT 0.00 COMMENT 'Remise appliquée',
  `pourcentage_remise` decimal(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de remise',
  `taxe` decimal(10,2) DEFAULT 0.00 COMMENT 'Taxes applicables',
  `montant_total` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Montant total de la commande',
  `montant_paye` decimal(10,2) DEFAULT 0.00 COMMENT 'Montant déjà payé',
  `montant_restant` decimal(10,2) DEFAULT 0.00 COMMENT 'Montant restant à payer',
  `mode_paiement_id` int(11) DEFAULT NULL COMMENT 'Référence au mode de paiement principal',
  `methode_paiement` varchar(50) DEFAULT NULL COMMENT 'Méthode de paiement (pour compatibilité)',
  `paiement_requis` tinyint(1) DEFAULT 1 COMMENT 'Paiement requis avant traitement',
  `paiement_partiel_autorise` tinyint(1) DEFAULT 0 COMMENT 'Autorise les paiements partiels',
  `adresse_facturation` text DEFAULT NULL COMMENT 'Adresse de facturation',
  `adresse_livraison` text NOT NULL COMMENT 'Adresse de livraison',
  `ville_livraison` varchar(100) DEFAULT NULL COMMENT 'Ville de livraison',
  `code_postal_livraison` varchar(20) DEFAULT NULL COMMENT 'Code postal de livraison',
  `pays_livraison` varchar(100) DEFAULT 'Sénégal' COMMENT 'Pays de livraison',
  `telephone_livraison` varchar(20) DEFAULT NULL COMMENT 'Téléphone pour la livraison',
  `type_livraison` enum('standard','express','point_relais','retrait_magasin','livraison_express') DEFAULT 'standard' COMMENT 'Type de livraison',
  `frais_livraison_type` enum('gratuit','fixe','pourcentage','distance') DEFAULT 'fixe' COMMENT 'Type de calcul des frais de livraison',
  `delai_livraison` int(3) DEFAULT 3 COMMENT 'Délai de livraison en jours',
  `instructions_livraison` text DEFAULT NULL COMMENT 'Instructions spéciales pour la livraison',
  `numero_suivi` varchar(100) DEFAULT NULL COMMENT 'Numéro de suivi de livraison',
  `transporteur` varchar(100) DEFAULT NULL COMMENT 'Nom du transporteur',
  `url_suivi` varchar(255) DEFAULT NULL COMMENT 'URL de suivi de la commande',
  `source_commande` enum('site_web','mobile','telephone','magasin','reseau_social','autre') DEFAULT 'site_web' COMMENT 'Source de la commande',
  `code_promotion` varchar(50) DEFAULT NULL COMMENT 'Code promotionnel utilisé',
  `campagne_marketing` varchar(100) DEFAULT NULL COMMENT 'Campagne marketing associée',
  `canal_vente` varchar(50) DEFAULT NULL COMMENT 'Canal de vente',
  `ip_client` varchar(45) DEFAULT NULL COMMENT 'Adresse IP du client',
  `user_agent` text DEFAULT NULL COMMENT 'User agent du navigateur',
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Informations sur l''appareil utilisé' CHECK (json_valid(`device_info`)),
  `notes_client` text DEFAULT NULL COMMENT 'Notes du client',
  `notes_internes` text DEFAULT NULL COMMENT 'Notes internes',
  `raison_annulation` text DEFAULT NULL COMMENT 'Raison de l''annulation',
  `commentaires_livraison` text DEFAULT NULL COMMENT 'Commentaires sur la livraison',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Date de création',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Date de dernière modification',
  `created_by` int(11) DEFAULT NULL COMMENT 'ID de l''utilisateur qui a créé la commande',
  `updated_by` int(11) DEFAULT NULL COMMENT 'ID de l''utilisateur qui a modifié la commande',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Métadonnées supplémentaires' CHECK (json_valid(`metadata`)),
  `tags` text DEFAULT NULL COMMENT 'Tags pour le classement'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table des commandes avec gestion complète du processus de vente';

--
-- Dumping data for table `commandes`
--

INSERT INTO `commandes` (`id`, `numero_commande`, `client_id`, `operateur_id`, `date_commande`, `date_livraison_prevue`, `date_livraison_reelle`, `date_annulation`, `statut`, `etape_actuelle`, `montant_sous_total`, `frais_livraison`, `frais_service`, `remise`, `pourcentage_remise`, `taxe`, `montant_total`, `montant_paye`, `montant_restant`, `mode_paiement_id`, `methode_paiement`, `paiement_requis`, `paiement_partiel_autorise`, `adresse_facturation`, `adresse_livraison`, `ville_livraison`, `code_postal_livraison`, `pays_livraison`, `telephone_livraison`, `type_livraison`, `frais_livraison_type`, `delai_livraison`, `instructions_livraison`, `numero_suivi`, `transporteur`, `url_suivi`, `source_commande`, `code_promotion`, `campagne_marketing`, `canal_vente`, `ip_client`, `user_agent`, `device_info`, `notes_client`, `notes_internes`, `raison_annulation`, `commentaires_livraison`, `created_at`, `updated_at`, `created_by`, `updated_by`, `metadata`, `tags`) VALUES
(15, 'CMD-2025-168053', 1, NULL, '2025-09-06 17:52:48', NULL, NULL, NULL, 'en_attente', 'validation', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 152.00, 0.00, 0.00, NULL, 'ESPECES', 1, 0, '12 Ngor Almadies', '12 Ngor Almadies', 'Dakar', '15545', 'Sénégal', '+221786519335', 'standard', 'fixe', 3, 'jgjhkykkjkgghpv;hob,vnokbn,kobhv', NULL, NULL, NULL, 'site_web', NULL, NULL, NULL, NULL, NULL, NULL, 'Email: bonheurthaddy0@gmail.com | Détails paiement: {} | Frais transaction: 0 | Montant net: 152', NULL, NULL, NULL, '2025-09-06 17:52:48', '2025-09-06 17:52:48', NULL, NULL, NULL, NULL),
(16, 'CMD-2025-151273', 1, NULL, '2025-09-07 11:22:31', NULL, NULL, NULL, 'en_attente', 'validation', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 36.00, 0.00, 0.00, NULL, 'ESPECES', 1, 0, 'bene tally robinet lassana', 'bene tally robinet lassana', 'Dakar', '15545', 'Sénégal', '+221786519335', 'retrait_magasin', 'fixe', 3, '', NULL, NULL, NULL, 'site_web', NULL, NULL, NULL, NULL, NULL, NULL, 'Email: bonheurthaddy0@gmail.com | Détails paiement: {} | Frais transaction: 0 | Montant net: 36', NULL, NULL, NULL, '2025-09-07 11:22:31', '2025-09-07 11:22:31', NULL, NULL, NULL, NULL),
(17, 'CMD-2025-715591', 1, NULL, '2025-09-09 21:51:55', NULL, NULL, NULL, '', 'validation', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10014.00, 0.00, 0.00, NULL, 'ESPECES', 1, 0, '14 bene tally robinet lassana', '14 bene tally robinet lassana', 'Dakar', '15545', 'Sénégal', '+221788677876', 'standard', 'fixe', 3, 'sonner à la porte', NULL, NULL, NULL, 'site_web', NULL, NULL, NULL, NULL, NULL, NULL, 'Email: bonheurthaddy0@gmail.com | Détails paiement: {} | Frais transaction: 0 | Montant net: 10014', NULL, NULL, NULL, '2025-09-09 21:51:55', '2025-09-09 21:51:55', NULL, NULL, NULL, NULL),
(18, 'CMD-2025-378177', 1, NULL, '2025-09-09 22:02:58', NULL, NULL, NULL, '', 'validation', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 20042.00, 0.00, 0.00, NULL, 'ESPECES', 1, 0, '14 bene tally robinet lassana', '14 bene tally robinet lassana', 'Dakar', '15545', 'Sénégal', '+221788677876', 'retrait_magasin', 'fixe', 3, '', NULL, NULL, NULL, 'site_web', NULL, NULL, NULL, NULL, NULL, NULL, 'Email: bonheurthaddy0@gmail.com | Détails paiement: {} | Frais transaction: 0 | Montant net: 20042', NULL, NULL, NULL, '2025-09-09 22:02:58', '2025-09-09 22:02:58', NULL, NULL, NULL, NULL),
(19, 'CMD-2025-417443', 2, NULL, '2025-09-10 22:46:57', NULL, NULL, NULL, '', 'validation', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 14.00, 0.00, 0.00, NULL, 'ESPECES', 1, 0, 'Bene tally robinet lassana', 'Bene tally robinet lassana', 'Dakar', '15545', 'Sénégal', '788677875', 'standard', 'fixe', 3, 'Sonner à la porte', NULL, NULL, NULL, 'site_web', NULL, NULL, NULL, NULL, NULL, NULL, 'Email: karamouzisfeza@gmail.com | Détails paiement: {} | Frais transaction: 0 | Montant net: 14', NULL, NULL, NULL, '2025-09-10 22:46:57', '2025-09-10 22:46:57', NULL, NULL, NULL, NULL),
(20, 'CMD-2025-438535', 2, NULL, '2025-09-10 23:03:58', NULL, NULL, NULL, 'en_attente', 'validation', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 42.00, 0.00, 0.00, NULL, 'ESPECES', 1, 0, '14 bene tally robinet lassana', '14 bene tally robinet lassana', 'Dakar', '15545', 'Sénégal', '+221788677876', 'retrait_magasin', 'fixe', 3, '', NULL, NULL, NULL, 'site_web', NULL, NULL, NULL, NULL, NULL, NULL, 'Email: bonheurthaddy0@gmail.com | Détails paiement: {} | Frais transaction: 0 | Montant net: 42', NULL, NULL, NULL, '2025-09-10 23:03:58', '2025-09-10 23:03:58', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `commandes_achat`
--

CREATE TABLE `commandes_achat` (
  `id` int(11) NOT NULL,
  `numero_achat` varchar(50) NOT NULL COMMENT 'Numéro unique PO ex: PO-2025-0001',
  `statut` enum('brouillon','envoyee','partiellement_reçue','reçue','annulee') NOT NULL DEFAULT 'brouillon',
  `date_commande` datetime NOT NULL DEFAULT current_timestamp(),
  `date_prevue` datetime DEFAULT NULL,
  `fournisseur_nom` varchar(255) DEFAULT NULL COMMENT 'Saisie libre: nom',
  `fournisseur_contact` varchar(255) DEFAULT NULL COMMENT 'Saisie libre: tel/email',
  `entrepot_id` int(11) DEFAULT NULL COMMENT 'Optionnel: pas de FK si non utilisé',
  `devise` varchar(3) NOT NULL DEFAULT 'XOF',
  `montant_sous_total` int(11) NOT NULL DEFAULT 0,
  `remise` int(11) NOT NULL DEFAULT 0,
  `taxe` int(11) NOT NULL DEFAULT 0,
  `frais` int(11) NOT NULL DEFAULT 0,
  `montant_total` int(11) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Commandes d''achat (PO)';

-- --------------------------------------------------------

--
-- Table structure for table `commandes_achat_details`
--

CREATE TABLE `commandes_achat_details` (
  `id` int(11) NOT NULL,
  `commande_achat_id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `quantite_commandee` int(11) NOT NULL,
  `quantite_recue` int(11) NOT NULL DEFAULT 0,
  `prix_unitaire_achat` int(11) NOT NULL DEFAULT 0,
  `remise_ligne` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lignes de commande d''achat';

-- --------------------------------------------------------

--
-- Table structure for table `commande_details`
--

CREATE TABLE `commande_details` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commande_details`
--

INSERT INTO `commande_details` (`id`, `commande_id`, `produit_id`, `quantite`, `prix`) VALUES
(1, 4, 1, 2, 1000),
(2, 5, 1, 2, 1000),
(3, 6, 22, 1, 85),
(7, 9, 22, 1, 85),
(8, 10, 21, 1, 180),
(9, 11, 21, 1, 180),
(10, 12, 21, 1, 180),
(11, 13, 21, 1, 180),
(12, 14, 22, 1, 85),
(13, 14, 21, 1, 180),
(14, 15, 9, 1, 60),
(15, 15, 3, 1, 130),
(16, 16, 80, 2, 18),
(17, 17, 71, 1, 18),
(18, 17, 101, 1, 2000),
(19, 18, 101, 2, 2000),
(20, 18, 71, 3, 18),
(21, 19, 71, 1, 18),
(22, 20, 71, 3, 18);

-- --------------------------------------------------------

--
-- Table structure for table `favoris`
--

CREATE TABLE `favoris` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventaires_cycliques`
--

CREATE TABLE `inventaires_cycliques` (
  `id` int(11) NOT NULL,
  `entrepot_id` int(11) DEFAULT NULL,
  `date_debut` datetime NOT NULL DEFAULT current_timestamp(),
  `date_fin` datetime DEFAULT NULL,
  `statut` enum('brouillon','en_cours','termine') NOT NULL DEFAULT 'brouillon',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Campagnes d''inventaire cyclique';

-- --------------------------------------------------------

--
-- Table structure for table `inventaires_cycliques_details`
--

CREATE TABLE `inventaires_cycliques_details` (
  `id` int(11) NOT NULL,
  `inventaire_id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `quantite_theorique` int(11) NOT NULL DEFAULT 0,
  `quantite_comptee` int(11) NOT NULL DEFAULT 0,
  `ecart` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Inventaires (comptages)';

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marques`
--

CREATE TABLE `marques` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `zone` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marques`
--

INSERT INTO `marques` (`id`, `nom`, `description`, `image_url`, `zone`, `created_at`, `updated_at`) VALUES
(1, 'Nike', 'Marque américaine de sportswear et d\'équipements sportifs, leader mondial dans le domaine de la chaussure de sport et des vêtements de sport.', '/uploads/marques/1757343889697.jpg', 'International', '2025-09-05 20:05:10', '2025-09-08 15:04:50'),
(2, 'Adidas', 'Marque allemande de sportswear, spécialisée dans les chaussures de sport, les vêtements et les accessoires. Connue pour ses trois bandes emblématiques.', '/uploads/marques/1757343871389.png', 'International', '2025-09-05 20:05:10', '2025-09-08 15:04:31'),
(3, 'Zara', 'Chaîne de mode espagnole appartenant au groupe Inditex, proposant des vêtements tendance pour hommes, femmes et enfants à des prix abordables.', '/images/garden.png', 'Europe', '2025-09-05 20:05:10', '2025-09-05 20:39:31'),
(4, 'H&M', 'Marque suédoise de mode accessible, offrant des vêtements, accessoires et cosmétiques pour toute la famille avec un engagement pour la mode durable.', '/uploads/marques/1757343850668.png', 'Europe', '2025-09-05 20:05:10', '2025-09-08 15:04:11'),
(6, 'KYA LIFE STYLE', 'Description de Kyalifestyle', '/uploads/marques/1757342082526.JPG', 'Afrique', '2025-09-08 14:34:43', '2025-09-08 14:34:43');

-- --------------------------------------------------------

--
-- Table structure for table `modes_paiement`
--

CREATE TABLE `modes_paiement` (
  `id` int(11) NOT NULL,
  `code_paiement` varchar(50) NOT NULL COMMENT 'Code unique du mode de paiement',
  `nom` varchar(100) NOT NULL COMMENT 'Nom du mode de paiement',
  `description` text DEFAULT NULL COMMENT 'Description détaillée',
  `type` enum('especes','carte_bancaire','orange_money','wave','cheque','crypto','paypal','stripe','api_externe','autre') NOT NULL COMMENT 'Type de mode de paiement',
  `categorie` enum('physique','electronique','en_ligne','crypto','virement') NOT NULL COMMENT 'Catégorie du mode de paiement',
  `frais_fixes` decimal(10,2) DEFAULT 0.00 COMMENT 'Frais fixes par transaction',
  `frais_pourcentage` decimal(5,2) DEFAULT 0.00 COMMENT 'Frais en pourcentage',
  `frais_minimum` decimal(10,2) DEFAULT 0.00 COMMENT 'Frais minimum',
  `frais_maximum` decimal(10,2) DEFAULT 0.00 COMMENT 'Frais maximum',
  `montant_minimum` decimal(10,2) DEFAULT 0.00 COMMENT 'Montant minimum',
  `montant_maximum` decimal(10,2) DEFAULT 0.00 COMMENT 'Montant maximum',
  `api_endpoint` varchar(255) DEFAULT NULL COMMENT 'URL de l''API',
  `api_key` varchar(255) DEFAULT NULL COMMENT 'Clé API (chiffrée)',
  `api_secret` varchar(255) DEFAULT NULL COMMENT 'Secret API (chiffré)',
  `webhook_url` varchar(255) DEFAULT NULL COMMENT 'URL de webhook',
  `config_params` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Paramètres de configuration' CHECK (json_valid(`config_params`)),
  `devises_supportees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Devises supportées' CHECK (json_valid(`devises_supportees`)),
  `devise_par_defaut` varchar(3) DEFAULT 'XOF' COMMENT 'Devise par défaut',
  `taux_change_auto` tinyint(1) DEFAULT 0 COMMENT 'Conversion automatique',
  `icone` varchar(255) DEFAULT NULL COMMENT 'URL de l''icône',
  `couleur` varchar(7) DEFAULT NULL COMMENT 'Couleur hexadécimale',
  `ordre_affichage` int(3) DEFAULT 0 COMMENT 'Ordre d''affichage',
  `nom_affichage` varchar(100) DEFAULT NULL COMMENT 'Nom à afficher',
  `actif` tinyint(1) DEFAULT 1 COMMENT 'Mode de paiement actif',
  `disponible_vente` tinyint(1) DEFAULT 1 COMMENT 'Disponible pour les ventes',
  `disponible_remboursement` tinyint(1) DEFAULT 1 COMMENT 'Disponible pour les remboursements',
  `disponible_depot` tinyint(1) DEFAULT 0 COMMENT 'Disponible pour les dépôts',
  `disponible_retrait` tinyint(1) DEFAULT 0 COMMENT 'Disponible pour les retraits',
  `disponible_transfert` tinyint(1) DEFAULT 0 COMMENT 'Disponible pour les transferts',
  `validation_requise` tinyint(1) DEFAULT 0 COMMENT 'Validation manuelle requise',
  `confirmation_requise` tinyint(1) DEFAULT 0 COMMENT 'Confirmation du client requise',
  `delai_validation` int(5) DEFAULT 0 COMMENT 'Délai de validation en minutes',
  `max_tentatives` int(3) DEFAULT 3 COMMENT 'Nombre maximum de tentatives',
  `support_telephone` varchar(20) DEFAULT NULL COMMENT 'Numéro de support',
  `support_email` varchar(100) DEFAULT NULL COMMENT 'Email de support',
  `documentation_url` varchar(255) DEFAULT NULL COMMENT 'URL de la documentation',
  `instructions` text DEFAULT NULL COMMENT 'Instructions d''utilisation',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Métadonnées supplémentaires' CHECK (json_valid(`metadata`)),
  `tags` text DEFAULT NULL COMMENT 'Tags pour le classement'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Configuration des modes de paiement disponibles';

--
-- Dumping data for table `modes_paiement`
--

INSERT INTO `modes_paiement` (`id`, `code_paiement`, `nom`, `description`, `type`, `categorie`, `frais_fixes`, `frais_pourcentage`, `frais_minimum`, `frais_maximum`, `montant_minimum`, `montant_maximum`, `api_endpoint`, `api_key`, `api_secret`, `webhook_url`, `config_params`, `devises_supportees`, `devise_par_defaut`, `taux_change_auto`, `icone`, `couleur`, `ordre_affichage`, `nom_affichage`, `actif`, `disponible_vente`, `disponible_remboursement`, `disponible_depot`, `disponible_retrait`, `disponible_transfert`, `validation_requise`, `confirmation_requise`, `delai_validation`, `max_tentatives`, `support_telephone`, `support_email`, `documentation_url`, `instructions`, `created_at`, `updated_at`, `created_by`, `updated_by`, `metadata`, `tags`) VALUES
(1, 'ESPECES', 'Espèces', 'Paiement en espèces', 'especes', 'physique', 0.00, 0.00, 0.00, 0.00, 0.00, 99999999.99, NULL, NULL, NULL, NULL, NULL, '[\"XOF\", \"EUR\", \"USD\"]', 'XOF', 0, '/images/paiement/especes.png', '#4CAF50', 1, 'Espèces', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Paiement en espèces à la livraison ou en magasin', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(2, 'ORANGE_MONEY', 'Orange Money', 'Paiement via Orange Money', 'orange_money', 'electronique', 0.00, 1.50, 0.00, 0.00, 100.00, 500000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\"]', 'XOF', 0, '/images/paiement/orange-money.png', '#FF6600', 2, 'Orange Money', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Utilisez votre compte Orange Money pour payer', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(3, 'WAVE', 'Wave', 'Paiement via Wave', 'wave', 'electronique', 0.00, 1.00, 0.00, 0.00, 50.00, 1000000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\", \"EUR\", \"USD\"]', 'XOF', 0, '/images/paiement/wave.png', '#00D4AA', 3, 'Wave', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Paiement sécurisé via Wave', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(4, 'FREE_MONEY', 'Free Money', 'Paiement via Free Money', '', 'electronique', 0.00, 1.50, 0.00, 0.00, 100.00, 500000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\"]', 'XOF', 0, '/images/paiement/free-money.png', '#00BFFF', 4, 'Free Money', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Utilisez votre compte Free Money pour payer', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(5, 'CARTE_BANCAIRE', 'Carte Bancaire', 'Paiement par carte bancaire', 'carte_bancaire', 'electronique', 50.00, 2.50, 0.00, 0.00, 500.00, 1000000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\", \"EUR\", \"USD\"]', 'XOF', 0, '/images/paiement/carte-bancaire.png', '#2196F3', 5, 'Carte Bancaire', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Paiement sécurisé par carte bancaire', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(6, 'VIREMENT_BANCAIRE', 'Virement Bancaire', 'Paiement par virement bancaire', '', 'virement', 100.00, 0.00, 0.00, 0.00, 1000.00, 5000000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\", \"EUR\", \"USD\"]', 'XOF', 0, '/images/paiement/virement.png', '#9C27B0', 6, 'Virement Bancaire', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Virement vers notre compte bancaire', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(7, 'CHEQUE', 'Chèque', 'Paiement par chèque', 'cheque', 'physique', 0.00, 0.00, 0.00, 0.00, 1000.00, 10000000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\", \"EUR\", \"USD\"]', 'XOF', 0, '/images/paiement/cheque.png', '#FF9800', 7, 'Chèque', 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Paiement par chèque à l\'ordre de Garden', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(8, 'PAYPAL', 'PayPal', 'Paiement via PayPal', 'paypal', 'en_ligne', 0.00, 3.40, 0.00, 0.00, 100.00, 100000.00, NULL, NULL, NULL, NULL, NULL, '[\"EUR\", \"USD\"]', 'EUR', 0, '/images/paiement/paypal.png', '#0070BA', 8, 'PayPal', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Paiement sécurisé via PayPal', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL),
(9, 'STRIPE', 'Stripe', 'Paiement via Stripe', 'stripe', 'en_ligne', 0.00, 2.90, 0.00, 0.00, 100.00, 100000.00, NULL, NULL, NULL, NULL, NULL, '[\"XOF\", \"EUR\", \"USD\"]', 'XOF', 0, '/images/paiement/stripe.png', '#635BFF', 9, 'Stripe', 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, '+221 33 123 45 67', 'support@garden.com', NULL, 'Paiement sécurisé via Stripe', '2025-09-06 13:51:08', '2025-09-06 13:51:08', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mouvements_stock`
--

CREATE TABLE `mouvements_stock` (
  `id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `entrepot_id` int(11) DEFAULT NULL,
  `type` enum('achat','vente','retour_client','retour_fournisseur','ajustement_plus','ajustement_moins','transfert_sortie','transfert_entree','inventaire') NOT NULL,
  `reference_type` enum('commande_achat','reception','commande_vente','ajustement','inventaire','transfert') DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `quantite` int(11) NOT NULL COMMENT 'Entrée: +, Sortie: -',
  `cout_unitaire` int(11) DEFAULT NULL COMMENT 'FCFA pour entrées (si dispo)',
  `date_mouvement` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Écritures de stock';

-- --------------------------------------------------------

--
-- Table structure for table `operateur`
--

CREATE TABLE `operateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(100) NOT NULL,
  `fonction` varchar(100) NOT NULL,
  `état` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paiements`
--

CREATE TABLE `paiements` (
  `id` int(11) NOT NULL,
  `numero_transaction` varchar(50) NOT NULL COMMENT 'Numéro unique de transaction (ex: TXN-2025-001)',
  `commande_id` int(11) DEFAULT NULL COMMENT 'Référence à la commande si applicable',
  `client_id` int(11) NOT NULL COMMENT 'Client concerné par la transaction',
  `operateur_id` int(11) DEFAULT NULL COMMENT 'Opérateur qui a traité la transaction',
  `montant` decimal(15,2) NOT NULL COMMENT 'Montant de la transaction (positif pour crédit, négatif pour débit)',
  `devise` varchar(3) NOT NULL DEFAULT 'XOF' COMMENT 'Devise (XOF, EUR, USD, etc.)',
  `taux_change` decimal(10,4) DEFAULT 1.0000 COMMENT 'Taux de change appliqué si différent de la devise de base',
  `montant_devise_base` decimal(15,2) NOT NULL COMMENT 'Montant converti en devise de base du système',
  `type_transaction` enum('vente_produit','vente_wellness','frais_livraison','remboursement','annulation','frais_service','commission','depot','retrait','transfert','bonus','reduction','taxe','autre') NOT NULL COMMENT 'Type de transaction',
  `sens_transaction` enum('debit','credit') NOT NULL COMMENT 'Sens de la transaction',
  `categorie` enum('vente','frais','remboursement','commission','taxe','fidélité','operation_interne','autre') NOT NULL COMMENT 'Catégorie de la transaction',
  `mode_paiement_id` int(11) NOT NULL COMMENT 'Référence au mode de paiement utilisé',
  `methode_paiement` varchar(50) NOT NULL COMMENT 'Méthode de paiement utilisée (pour compatibilité)',
  `details_paiement` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Détails spécifiques selon la méthode (numéro de carte, référence mobile money, etc.)' CHECK (json_valid(`details_paiement`)),
  `statut` enum('en_attente','en_cours','valide','echec','annule','rembourse','suspendu') NOT NULL DEFAULT 'en_attente' COMMENT 'Statut de la transaction',
  `date_validation` datetime DEFAULT NULL COMMENT 'Date de validation de la transaction',
  `valide_par` int(11) DEFAULT NULL COMMENT 'ID de l''opérateur qui a validé',
  `reference_externe` varchar(100) DEFAULT NULL COMMENT 'Référence fournie par le système de paiement externe',
  `transaction_id_externe` varchar(100) DEFAULT NULL COMMENT 'ID de transaction du système externe',
  `receipt_number` varchar(50) DEFAULT NULL COMMENT 'Numéro de reçu',
  `description` text DEFAULT NULL COMMENT 'Description détaillée de la transaction',
  `notes_internes` text DEFAULT NULL COMMENT 'Notes internes pour le suivi',
  `ip_client` varchar(45) DEFAULT NULL COMMENT 'Adresse IP du client',
  `user_agent` text DEFAULT NULL COMMENT 'User agent du navigateur',
  `device_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Informations sur l''appareil utilisé' CHECK (json_valid(`device_info`)),
  `frais_transaction` decimal(10,2) DEFAULT 0.00 COMMENT 'Frais de transaction',
  `commission_systeme` decimal(10,2) DEFAULT 0.00 COMMENT 'Commission du système',
  `commission_operateur` decimal(10,2) DEFAULT 0.00 COMMENT 'Commission de l''opérateur',
  `montant_net` decimal(15,2) NOT NULL COMMENT 'Montant net après déduction des frais',
  `code_erreur` varchar(20) DEFAULT NULL COMMENT 'Code d''erreur si échec',
  `message_erreur` text DEFAULT NULL COMMENT 'Message d''erreur détaillé',
  `tentatives` int(3) DEFAULT 0 COMMENT 'Nombre de tentatives de traitement',
  `derniere_tentative` datetime DEFAULT NULL COMMENT 'Date de la dernière tentative',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Date de création',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Date de dernière modification',
  `created_by` int(11) DEFAULT NULL COMMENT 'ID de l''utilisateur qui a créé la transaction',
  `updated_by` int(11) DEFAULT NULL COMMENT 'ID de l''utilisateur qui a modifié la transaction',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Métadonnées supplémentaires (données flexibles)' CHECK (json_valid(`metadata`)),
  `tags` text DEFAULT NULL COMMENT 'Tags pour le classement et la recherche'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Table de traçabilité complète de toutes les transactions financières';

--
-- Dumping data for table `paiements`
--

INSERT INTO `paiements` (`id`, `numero_transaction`, `commande_id`, `client_id`, `operateur_id`, `montant`, `devise`, `taux_change`, `montant_devise_base`, `type_transaction`, `sens_transaction`, `categorie`, `mode_paiement_id`, `methode_paiement`, `details_paiement`, `statut`, `date_validation`, `valide_par`, `reference_externe`, `transaction_id_externe`, `receipt_number`, `description`, `notes_internes`, `ip_client`, `user_agent`, `device_info`, `frais_transaction`, `commission_systeme`, `commission_operateur`, `montant_net`, `code_erreur`, `message_erreur`, `tentatives`, `derniere_tentative`, `created_at`, `updated_at`, `created_by`, `updated_by`, `metadata`, `tags`) VALUES
(8, 'TXN-2025-168425', 15, 1, NULL, 152.00, 'XOF', 1.0000, 152.00, 'vente_produit', 'credit', 'vente', 1, 'ESPECES', '{}', 'en_attente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 152.00, NULL, NULL, 0, NULL, '2025-09-06 17:52:48', '2025-09-06 17:52:48', NULL, NULL, NULL, NULL),
(9, 'TXN-2025-151499', 16, 1, NULL, 36.00, 'XOF', 1.0000, 36.00, 'vente_produit', 'credit', 'vente', 1, 'ESPECES', '{}', 'en_attente', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 36.00, NULL, NULL, 0, NULL, '2025-09-07 11:22:31', '2025-09-07 11:22:31', NULL, NULL, NULL, NULL),
(10, 'TXN-2025-716220', 17, 1, NULL, 10014.00, 'XOF', 1.0000, 10014.00, 'vente_produit', 'credit', 'vente', 1, 'ESPECES', '{}', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 10014.00, NULL, NULL, 0, NULL, '2025-09-09 21:51:56', '2025-09-09 21:51:56', NULL, NULL, NULL, NULL),
(11, 'TXN-2025-378671', 18, 1, NULL, 20042.00, 'XOF', 1.0000, 20042.00, 'vente_produit', 'credit', 'vente', 1, 'ESPECES', '{}', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 20042.00, NULL, NULL, 0, NULL, '2025-09-09 22:02:58', '2025-09-09 22:02:58', NULL, NULL, NULL, NULL),
(12, 'TXN-2025-417749', 19, 2, NULL, 14.00, 'XOF', 1.0000, 14.00, 'vente_produit', 'credit', 'vente', 1, 'ESPECES', '{}', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 14.00, NULL, NULL, 0, NULL, '2025-09-10 22:46:57', '2025-09-10 22:46:57', NULL, NULL, NULL, NULL),
(13, 'TXN-2025-438863', 20, 2, NULL, 42.00, 'XOF', 1.0000, 42.00, 'vente_produit', 'credit', 'vente', 1, 'ESPECES', '{}', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.00, 0.00, 0.00, 42.00, NULL, NULL, 0, NULL, '2025-09-10 23:03:59', '2025-09-10 23:03:59', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `panier`
--

CREATE TABLE `panier` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `requested_ip` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `used_at`, `requested_ip`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 1, '6b3643e66bdd4013a0cc5ed966133f9a5383456aa68179c2e155116e0d5e9053', '2025-09-09 08:22:21', '2025-09-09 06:52:44', '::1', 'curl/8.7.1', '2025-09-09 06:52:22', '2025-09-09 06:52:44'),
(2, 1, 'd064a22ee50aad497709df11e2d128e4670b9a179745a5c855738805759faf00', '2025-09-09 08:22:44', '2025-09-09 06:54:09', '::1', 'curl/8.7.1', '2025-09-09 06:52:44', '2025-09-09 06:54:09'),
(3, 1, 'd51aa8ca2be856f763b9318b140a91073508f4359d0aa430e04fb1148da6d909', '2025-09-09 08:24:09', '2025-09-09 06:55:52', '::1', 'curl/8.7.1', '2025-09-09 06:54:09', '2025-09-09 06:55:52'),
(4, 1, '7f72bca0013e34a97cf869886c03cd76d2cdd345658f026aa6cb8c70cc462080', '2025-09-09 08:25:52', '2025-09-09 06:56:30', '127.0.0.1', 'Test Script', '2025-09-09 06:55:52', '2025-09-09 06:56:30'),
(5, 1, '68ad8583214f9c7a5c97e2194a0bb8461d916a01b914625c554d23b7a5ea7b36', '2025-09-09 08:32:13', '2025-09-09 07:15:58', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-09 07:02:14', '2025-09-09 07:15:58'),
(6, 1, '32314f7d3253bb94e62bd058e054f8af20635ffd8b28793fff2993fe18523e1f', '2025-09-11 00:02:11', '2025-09-10 22:33:57', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-09-10 22:32:11', '2025-09-10 22:33:57');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produits`
--

CREATE TABLE `produits` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_courte` varchar(500) DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  `prix_reduction` decimal(10,2) DEFAULT NULL,
  `pourcentage_reduction` int(11) DEFAULT 0,
  `sku` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `stock_minimum` int(11) DEFAULT 5,
  `poids` decimal(8,2) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `couleur` varchar(100) DEFAULT NULL,
  `taille` varchar(50) DEFAULT NULL,
  `materiau` varchar(100) DEFAULT NULL,
  `marque_id` int(11) NOT NULL,
  `sous_categorie_id` int(11) NOT NULL,
  `collection_id` int(11) DEFAULT NULL,
  `nouveaute` tinyint(1) DEFAULT 0,
  `en_vedette` tinyint(1) DEFAULT 0,
  `en_solde` tinyint(1) DEFAULT 0,
  `actif` tinyint(1) DEFAULT 1,
  `meta_titre` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produits`
--

INSERT INTO `produits` (`id`, `nom`, `slug`, `description`, `description_courte`, `prix`, `prix_reduction`, `pourcentage_reduction`, `sku`, `stock`, `stock_minimum`, `poids`, `dimensions`, `couleur`, `taille`, `materiau`, `marque_id`, `sous_categorie_id`, `collection_id`, `nouveaute`, `en_vedette`, `en_solde`, `actif`, `meta_titre`, `meta_description`, `tags`, `created_at`, `updated_at`) VALUES
(1, 'Air Max 270', 'air-max-270-1', 'Chaussures de running avec technologie Air Max pour un confort maximal', 'Running confortable', 150.00, 120.00, 20, 'NIKE-AM270-001', 25, 5, NULL, NULL, 'Noir/Blanc', '42', NULL, 1, 1, 1, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(2, 'Air Force 1', 'air-force-1-2', 'Baskets iconiques en cuir blanc classique', 'Baskets classiques', 90.00, NULL, 0, 'NIKE-AF1-002', 30, 5, NULL, NULL, 'Blanc', '41', NULL, 1, 1, 1, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(3, 'React Element 55', 'react-element-55-3', 'Chaussures de running avec semelle React pour la réactivité', 'Running réactif', 130.00, 104.00, 20, 'NIKE-RE55-003', 20, 5, NULL, NULL, 'Gris/Rose', '43', NULL, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(4, 'Blazer Mid', 'blazer-mid-4', 'Baskets rétro en cuir avec style vintage', 'Style rétro', 80.00, NULL, 0, 'NIKE-BM-004', 15, 5, NULL, NULL, 'Blanc/Rouge', '40', NULL, 1, 1, 1, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(5, 'Pegasus 38', 'pegasus-38-5', 'Chaussures de running avec amorti Zoom Air', 'Running amorti', 120.00, 96.00, 20, 'NIKE-P38-005', 35, 5, NULL, NULL, 'Bleu/Orange', '44', NULL, 1, 1, 1, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(6, 'Dri-FIT T-Shirt', 'dri-fit-t-shirt-6', 'T-shirt technique qui évacue la transpiration', 'T-shirt technique', 25.00, NULL, 0, 'NIKE-DFT-006', 50, 5, NULL, NULL, 'Noir', 'L', NULL, 1, 2, 1, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(7, 'Sportswear Shorts', 'sportswear-shorts-7', 'Shorts de sport confortables avec poche zippée', 'Shorts confortables', 35.00, 28.00, 20, 'NIKE-SWS-007', 40, 5, NULL, NULL, 'Gris', 'M', NULL, 1, 2, 1, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(8, 'Hoodie Tech Fleece', 'hoodie-tech-fleece-8', 'Sweat à capuche avec technologie Tech Fleece', 'Sweat technique', 80.00, NULL, 0, 'NIKE-HTF-008', 25, 5, NULL, NULL, 'Bleu', 'XL', NULL, 1, 2, 1, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(9, 'Dri-FIT Pants', 'dri-fit-pants-9', 'Pantalon technique pour le sport', 'Pantalon technique', 60.00, 48.00, 20, 'NIKE-DFP-009', 30, 5, NULL, NULL, 'Noir', 'L', NULL, 1, 2, 1, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(10, 'Windrunner Jacket', 'windrunner-jacket-10', 'Veste légère résistante au vent', 'Veste résistante', 100.00, NULL, 0, 'NIKE-WJ-010', 20, 5, NULL, NULL, 'Vert', 'M', NULL, 1, 2, 1, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(11, 'Dri-FIT Leggings', 'dri-fit-leggings-11', 'Leggings techniques pour le sport', 'Leggings techniques', 45.00, NULL, 0, 'NIKE-DFL-011', 35, 5, NULL, NULL, 'Noir', 'M', NULL, 1, 3, 2, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(12, 'Sports Bra', 'sports-bra-12', 'Soutien-gorge de sport à maintien élevé', 'Soutien-gorge sport', 30.00, 24.00, 20, 'NIKE-SB-012', 40, 5, NULL, NULL, 'Rose', 'S', NULL, 1, 3, 2, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(13, 'Dri-FIT Tank Top', 'dri-fit-tank-top-13', 'Débardeur technique pour femme', 'Débardeur technique', 20.00, NULL, 0, 'NIKE-DFTT-013', 45, 5, NULL, NULL, 'Blanc', 'L', NULL, 1, 3, 2, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(14, 'Sportswear Shorts', 'sportswear-shorts-14', 'Shorts de sport pour femme', 'Shorts sport', 25.00, 20.00, 20, 'NIKE-SWSF-014', 30, 5, NULL, NULL, 'Gris', 'M', NULL, 1, 3, 2, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(15, 'Hoodie Tech Fleece', 'hoodie-tech-fleece-15', 'Sweat à capuche pour femme', 'Sweat femme', 70.00, NULL, 0, 'NIKE-HTFF-015', 25, 5, NULL, NULL, 'Violet', 'S', NULL, 1, 3, 2, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:25:09', '2025-09-05 23:59:11'),
(21, 'Ultraboost 22', 'ultraboost-22-21', 'Chaussures de running avec technologie Boost pour un retour d\'énergie maximal', 'Running Boost', 180.00, 144.00, 20, 'ADIDAS-UB22-001', 20, 5, NULL, NULL, 'Blanc/Noir', '42', NULL, 2, 5, 3, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(22, 'Stan Smith', 'stan-smith-22', 'Baskets iconiques en cuir blanc avec détails verts', 'Baskets classiques', 85.00, NULL, 0, 'ADIDAS-SS-002', 35, 5, NULL, NULL, 'Blanc/Vert', '41', NULL, 2, 5, 3, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(23, 'NMD R1', 'nmd-r1-23', 'Chaussures lifestyle avec semelle Boost', 'Lifestyle Boost', 140.00, 112.00, 20, 'ADIDAS-NMD-003', 25, 5, NULL, NULL, 'Gris/Rouge', '43', NULL, 2, 5, 3, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(24, 'Gazelle', 'gazelle-24', 'Baskets rétro en suède avec style vintage', 'Style rétro', 75.00, NULL, 0, 'ADIDAS-GZ-004', 30, 5, NULL, NULL, 'Bleu', '40', NULL, 2, 5, 3, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(25, 'Solarboost 4', 'solarboost-4-25', 'Chaussures de running avec technologie Solarboost', 'Running Solarboost', 160.00, 128.00, 20, 'ADIDAS-SB4-005', 15, 5, NULL, NULL, 'Orange/Noir', '44', NULL, 2, 5, 3, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(26, 'Climalite T-Shirt', 'climalite-t-shirt-26', 'T-shirt technique qui évacue l\'humidité', 'T-shirt technique', 30.00, NULL, 0, 'ADIDAS-CLT-006', 45, 5, NULL, NULL, 'Noir', 'L', NULL, 2, 6, 3, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(27, 'Tiro 21 Shorts', 'tiro-21-shorts-27', 'Shorts de football avec technologie Climalite', 'Shorts football', 40.00, 32.00, 20, 'ADIDAS-TS-007', 35, 5, NULL, NULL, 'Blanc', 'M', NULL, 2, 6, 3, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(28, 'Hoodie Essentials', 'hoodie-essentials-28', 'Sweat à capuche confortable', 'Sweat confortable', 70.00, NULL, 0, 'ADIDAS-HE-008', 30, 5, NULL, NULL, 'Gris', 'XL', NULL, 2, 6, 3, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(29, 'Tiro 21 Pants', 'tiro-21-pants-29', 'Pantalon de football technique', 'Pantalon football', 55.00, 44.00, 20, 'ADIDAS-TP-009', 25, 5, NULL, NULL, 'Noir', 'L', NULL, 2, 6, 3, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(30, 'Windbreaker', 'windbreaker-30', 'Veste résistante au vent', 'Veste résistante', 90.00, NULL, 0, 'ADIDAS-WB-010', 20, 5, NULL, NULL, 'Bleu', 'M', NULL, 2, 6, 3, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(31, 'Adicolor Leggings', 'adicolor-leggings-31', 'Leggings colorés pour le sport', 'Leggings colorés', 50.00, NULL, 0, 'ADIDAS-AL-011', 40, 5, NULL, NULL, 'Rose', 'M', NULL, 2, 7, 4, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(32, 'Sports Bra', 'sports-bra-32', 'Soutien-gorge de sport à maintien élevé', 'Soutien-gorge sport', 35.00, 28.00, 20, 'ADIDAS-SB-012', 45, 5, NULL, NULL, 'Noir', 'S', NULL, 2, 7, 4, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(33, 'Climalite Tank Top', 'climalite-tank-top-33', 'Débardeur technique pour femme', 'Débardeur technique', 25.00, NULL, 0, 'ADIDAS-CTT-013', 50, 5, NULL, NULL, 'Blanc', 'L', NULL, 2, 7, 4, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(34, 'Adicolor Shorts', 'adicolor-shorts-34', 'Shorts colorés pour femme', 'Shorts colorés', 30.00, 24.00, 20, 'ADIDAS-AS-014', 35, 5, NULL, NULL, 'Bleu', 'M', NULL, 2, 7, 4, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(35, 'Hoodie Essentials', 'hoodie-essentials-35', 'Sweat à capuche pour femme', 'Sweat femme', 65.00, NULL, 0, 'ADIDAS-HEF-015', 25, 5, NULL, NULL, 'Violet', 'S', NULL, 2, 7, 4, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(36, 'Climalite Socks', 'climalite-socks-36', 'Chaussettes techniques qui évacuent l\'humidité', 'Chaussettes techniques', 18.00, NULL, 0, 'ADIDAS-CS-016', 80, 5, NULL, NULL, 'Blanc', NULL, NULL, 2, 8, 4, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(37, 'Tiro 21 Cap', 'tiro-21-cap-37', 'Casquette de football avec logo Adidas', 'Casquette football', 28.00, 22.40, 20, 'ADIDAS-TC-017', 40, 5, NULL, NULL, 'Noir', NULL, NULL, 2, 8, 4, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(38, 'Gym Bag', 'gym-bag-38', 'Sac de sport spacieux', 'Sac de sport', 45.00, NULL, 0, 'ADIDAS-GB-018', 25, 5, NULL, NULL, 'Noir', NULL, NULL, 2, 8, 4, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(39, 'Water Bottle', 'water-bottle-39', 'Gourde de sport avec bouchon sport', 'Gourde sport', 22.00, 17.60, 20, 'ADIDAS-WB-019', 50, 5, NULL, NULL, 'Transparent', NULL, NULL, 2, 8, 4, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(40, 'Headband', 'headband-40', 'Bandeau de sport absorbant', 'Bandeau sport', 15.00, NULL, 0, 'ADIDAS-HB-020', 70, 5, NULL, NULL, 'Blanc', NULL, NULL, 2, 8, 4, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:08', '2025-09-05 23:59:11'),
(41, 'Robe Midi', 'robe-midi-41', 'Robe midi élégante en coton', 'Robe élégante', 45.00, 36.00, 20, 'ZARA-RM-001', 30, 5, NULL, NULL, 'Noir', 'M', NULL, 3, 9, 5, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(42, 'Blazer Femme', 'blazer-femme-42', 'Blazer structuré pour femme', 'Blazer structuré', 65.00, NULL, 0, 'ZARA-BF-002', 25, 5, NULL, NULL, 'Beige', 'L', NULL, 3, 9, 5, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(43, 'Jeans Skinny', 'jeans-skinny-43', 'Jeans skinny en denim stretch', 'Jeans skinny', 35.00, 28.00, 20, 'ZARA-JS-003', 40, 5, NULL, NULL, 'Bleu', 'S', NULL, 3, 9, 5, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(44, 'Top Brodé', 'top-brode-44', 'Top brodé avec détails floraux', 'Top brodé', 25.00, NULL, 0, 'ZARA-TB-004', 35, 5, NULL, NULL, 'Blanc', 'M', NULL, 3, 9, 5, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(45, 'Pantalon Taille Haute', 'pantalon-taille-haute-45', 'Pantalon taille haute en coton', 'Pantalon taille haute', 40.00, 32.00, 20, 'ZARA-PTH-005', 20, 5, NULL, NULL, 'Gris', 'L', NULL, 3, 9, 5, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(46, 'Chemise Oxford', 'chemise-oxford-46', 'Chemise en coton Oxford', 'Chemise Oxford', 35.00, NULL, 0, 'ZARA-CO-006', 40, 5, NULL, NULL, 'Blanc', 'L', NULL, 3, 10, 5, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(47, 'Pantalon Chino', 'pantalon-chino-47', 'Pantalon chino en coton', 'Pantalon chino', 45.00, 36.00, 20, 'ZARA-PC-007', 30, 5, NULL, NULL, 'Beige', 'M', NULL, 3, 10, 5, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(48, 'T-shirt Basique', 't-shirt-basique-48', 'T-shirt en coton bio', 'T-shirt basique', 15.00, NULL, 0, 'ZARA-TB-008', 50, 5, NULL, NULL, 'Gris', 'XL', NULL, 3, 10, 5, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(49, 'Veste Denim', 'veste-denim-49', 'Veste en denim classique', 'Veste denim', 55.00, 44.00, 20, 'ZARA-VD-009', 25, 5, NULL, NULL, 'Bleu', 'L', NULL, 3, 10, 5, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(50, 'Short Cargo', 'short-cargo-50', 'Short cargo avec poches', 'Short cargo', 30.00, NULL, 0, 'ZARA-SC-010', 35, 5, NULL, NULL, 'Vert', 'M', NULL, 3, 10, 5, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:30:32', '2025-09-05 23:59:11'),
(63, 'Jeans Mom', 'jeans-mom-63', 'Jeans mom fit en denim stretch', 'Jeans mom', 40.00, 32.00, 20, 'HM-JM-003', 25, 5, NULL, NULL, 'Bleu', 'S', NULL, 4, 13, NULL, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(65, 'Pantalon Taille Haute', 'pantalon-taille-haute-65', 'Pantalon taille haute en coton', 'Pantalon taille haute', 45.00, 36.00, 20, 'HM-PTH-005', 15, 5, NULL, NULL, 'Noir', 'L', NULL, 4, 13, NULL, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(71, 'Robe Fille', 'robe-fille', 'Robe colorée pour fille', 'Robe fille', 18.00, 14.00, 20, 'HM-RF-011', 30, 5, NULL, NULL, 'Jaune', '6 ans', NULL, 4, 15, NULL, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-08 16:44:34'),
(72, 'T-shirt Garçon', 't-shirt-garçon-72', 'T-shirt avec motif pour garçon', 'T-shirt garçon', 10.00, NULL, 0, 'HM-TG-012', 40, 5, NULL, NULL, 'Rouge', '8 ans', NULL, 4, 15, NULL, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(73, 'Pantalon Enfant', 'pantalon-enfant-73', 'Pantalon confortable pour enfant', 'Pantalon enfant', 15.00, 12.00, 20, 'HM-PE-013', 35, 5, NULL, NULL, 'Bleu', '10 ans', NULL, 4, 15, NULL, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(74, 'Veste Enfant', 'veste-enfant-74', 'Veste légère pour enfant', 'Veste enfant', 20.00, NULL, 0, 'HM-VE-014', 25, 5, NULL, NULL, 'Vert', '6 ans', NULL, 4, 15, NULL, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(75, 'Short Enfant', 'short-enfant-75', 'Short de sport pour enfant', 'Short enfant', 12.00, 9.60, 20, 'HM-SE-015', 45, 5, NULL, NULL, 'Orange', '8 ans', NULL, 4, 15, NULL, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(76, 'Sac à Dos', 'sac-à-dos-76', 'Sac à dos en coton recyclé', 'Sac à dos', 25.00, NULL, 0, 'HM-SAD-016', 30, 5, NULL, NULL, 'Noir', NULL, NULL, 4, 16, NULL, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(77, 'Bijoux', 'bijoux-77', 'Collier en métal doré', 'Collier doré', 12.00, 9.60, 20, 'HM-B-017', 50, 5, NULL, NULL, 'Doré', NULL, NULL, 4, 16, NULL, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(78, 'Écharpe', 'écharpe-78', 'Écharpe en laine recyclée', 'Écharpe laine', 20.00, NULL, 0, 'HM-E-018', 35, 5, NULL, NULL, 'Gris', NULL, NULL, 4, 16, NULL, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(79, 'Ceinture', 'ceinture-79', 'Ceinture en cuir synthétique', 'Ceinture synthétique', 15.00, 12.00, 20, 'HM-C-019', 40, 5, NULL, NULL, 'Marron', NULL, NULL, 4, 16, NULL, 0, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(80, 'Chapeau', 'chapeau-80', 'Chapeau en coton bio', 'Chapeau bio', 18.00, NULL, 0, 'HM-CH-020', 25, 5, NULL, NULL, 'Beige', NULL, NULL, 4, 16, NULL, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-05 20:35:21', '2025-09-05 23:59:11'),
(101, 'Bonheur Mode', 'bonheur-mode', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem', 'Description courte de bonheur mode', 2000.00, 10000.00, 0, 'Bonheur', 5, 2, 0.50, '60 x 40', 'Verte', 'XL', 'Fil à fil', 2, 9, NULL, 1, 0, 0, 1, 'Bonheur Mode', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem1', 'mode', '2025-09-08 16:29:18', '2025-09-08 16:41:43');

-- --------------------------------------------------------

--
-- Table structure for table `produit_images`
--

CREATE TABLE `produit_images` (
  `id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_alt` varchar(255) DEFAULT NULL,
  `ordre` int(11) DEFAULT 0,
  `is_principal` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produit_images`
--

INSERT INTO `produit_images` (`id`, `produit_id`, `image_url`, `image_alt`, `ordre`, `is_principal`, `created_at`) VALUES
(1, 1, '/images/products/nike-air-max-270-1.jpg', 'Nike Air Max 270 - Vue de face', 1, 1, '2025-09-05 22:23:48'),
(2, 1, '/images/products/nike-air-max-270-2.jpg', 'Nike Air Max 270 - Vue de côté', 2, 0, '2025-09-05 22:23:48'),
(3, 1, '/images/products/nike-air-max-270-3.jpg', 'Nike Air Max 270 - Vue arrière', 3, 0, '2025-09-05 22:23:48'),
(4, 1, '/images/products/nike-air-max-270-4.jpg', 'Nike Air Max 270 - Détail semelle', 4, 0, '2025-09-05 22:23:48'),
(5, 2, '/images/products/nike-af1-1.jpg', 'Nike Air Force 1 - Vue de face', 1, 1, '2025-09-05 22:23:48'),
(6, 2, '/images/products/nike-af1-2.jpg', 'Nike Air Force 1 - Vue de côté', 2, 0, '2025-09-05 22:23:48'),
(7, 2, '/images/products/nike-af1-3.jpg', 'Nike Air Force 1 - Vue arrière', 3, 0, '2025-09-05 22:23:48'),
(8, 21, '/images/products/adidas-ultraboost-1.jpg', 'Adidas Ultraboost 22 - Vue de face', 1, 1, '2025-09-05 22:23:48'),
(9, 21, '/images/products/adidas-ultraboost-2.jpg', 'Adidas Ultraboost 22 - Vue de côté', 2, 0, '2025-09-05 22:23:48'),
(10, 21, '/images/products/adidas-ultraboost-3.jpg', 'Adidas Ultraboost 22 - Vue arrière', 3, 0, '2025-09-05 22:23:48'),
(11, 21, '/images/products/adidas-ultraboost-4.jpg', 'Adidas Ultraboost 22 - Détail Boost', 4, 0, '2025-09-05 22:23:48'),
(12, 41, '/images/products/zara-robe-midi-1.jpg', 'Zara Robe Midi - Vue de face', 1, 1, '2025-09-05 22:23:48'),
(13, 41, '/images/products/zara-robe-midi-2.jpg', 'Zara Robe Midi - Vue de côté', 2, 0, '2025-09-05 22:23:48'),
(14, 41, '/images/products/zara-robe-midi-3.jpg', 'Zara Robe Midi - Détail dos', 3, 0, '2025-09-05 22:23:48'),
(22, 101, '/uploads/products/1757348957538-ds4kkerqw.jpeg', NULL, 1, 0, '2025-09-08 16:29:18'),
(23, 101, '/uploads/products/1757348957538-xfevlvouc.JPG', NULL, 2, 0, '2025-09-08 16:29:18'),
(24, 101, '/uploads/products/1757348957540-71l582aw8.JPG', NULL, 3, 0, '2025-09-08 16:29:19'),
(25, 71, '/uploads/products/1757349873085-nbmlv96i3.jpg', NULL, 0, 1, '2025-09-08 16:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `produit_variantes`
--

CREATE TABLE `produit_variantes` (
  `id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `prix_reduction` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `poids` decimal(8,2) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produit_variantes`
--

INSERT INTO `produit_variantes` (`id`, `produit_id`, `sku`, `prix`, `prix_reduction`, `stock`, `poids`, `image_url`, `actif`, `created_at`, `updated_at`) VALUES
(1, 1, 'NIKE-AM270-001', 150.00, 120.00, 25, NULL, NULL, 1, '2025-09-06 00:38:43', '2025-09-06 00:38:43'),
(2, 2, 'NIKE-AF1-002', 90.00, NULL, 30, NULL, NULL, 1, '2025-09-06 00:38:45', '2025-09-06 00:38:45'),
(3, 3, 'NIKE-RE55-003', 130.00, 104.00, 20, NULL, NULL, 1, '2025-09-06 00:38:46', '2025-09-06 00:38:46'),
(4, 4, 'NIKE-BM-004', 80.00, NULL, 15, NULL, NULL, 1, '2025-09-06 00:38:47', '2025-09-06 00:38:47'),
(5, 5, 'NIKE-P38-005', 120.00, 96.00, 35, NULL, NULL, 1, '2025-09-06 00:38:49', '2025-09-06 00:38:49'),
(6, 6, 'NIKE-DFT-006', 25.00, NULL, 50, NULL, NULL, 1, '2025-09-06 00:38:51', '2025-09-06 00:38:51'),
(7, 7, 'NIKE-SWS-007', 35.00, 28.00, 40, NULL, NULL, 1, '2025-09-06 00:38:52', '2025-09-06 00:38:52'),
(8, 8, 'NIKE-HTF-008', 80.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:38:53', '2025-09-06 00:38:53'),
(9, 9, 'NIKE-DFP-009', 60.00, 48.00, 30, NULL, NULL, 1, '2025-09-06 00:38:54', '2025-09-06 00:38:54'),
(10, 10, 'NIKE-WJ-010', 100.00, NULL, 20, NULL, NULL, 1, '2025-09-06 00:38:55', '2025-09-06 00:38:55'),
(11, 11, 'NIKE-DFL-011', 45.00, NULL, 35, NULL, NULL, 1, '2025-09-06 00:38:56', '2025-09-06 00:38:56'),
(12, 12, 'NIKE-SB-012', 30.00, 24.00, 40, NULL, NULL, 1, '2025-09-06 00:38:57', '2025-09-06 00:38:57'),
(13, 13, 'NIKE-DFTT-013', 20.00, NULL, 45, NULL, NULL, 1, '2025-09-06 00:38:58', '2025-09-06 00:38:58'),
(14, 14, 'NIKE-SWSF-014', 25.00, 20.00, 30, NULL, NULL, 1, '2025-09-06 00:38:59', '2025-09-06 00:38:59'),
(15, 15, 'NIKE-HTFF-015', 70.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:39:00', '2025-09-06 00:39:00'),
(21, 21, 'ADIDAS-UB22-001', 180.00, 144.00, 20, NULL, NULL, 1, '2025-09-06 00:39:04', '2025-09-06 00:39:04'),
(22, 22, 'ADIDAS-SS-002', 85.00, NULL, 35, NULL, NULL, 1, '2025-09-06 00:39:05', '2025-09-06 00:39:05'),
(23, 23, 'ADIDAS-NMD-003', 140.00, 112.00, 25, NULL, NULL, 1, '2025-09-06 00:39:06', '2025-09-06 00:39:06'),
(24, 24, 'ADIDAS-GZ-004', 75.00, NULL, 30, NULL, NULL, 1, '2025-09-06 00:39:08', '2025-09-06 00:39:08'),
(25, 25, 'ADIDAS-SB4-005', 160.00, 128.00, 15, NULL, NULL, 1, '2025-09-06 00:39:09', '2025-09-06 00:39:09'),
(26, 26, 'ADIDAS-CLT-006', 30.00, NULL, 45, NULL, NULL, 1, '2025-09-06 00:39:10', '2025-09-06 00:39:10'),
(27, 27, 'ADIDAS-TS-007', 40.00, 32.00, 35, NULL, NULL, 1, '2025-09-06 00:39:11', '2025-09-06 00:39:11'),
(28, 28, 'ADIDAS-HE-008', 70.00, NULL, 30, NULL, NULL, 1, '2025-09-06 00:39:12', '2025-09-06 00:39:12'),
(29, 29, 'ADIDAS-TP-009', 55.00, 44.00, 25, NULL, NULL, 1, '2025-09-06 00:39:13', '2025-09-06 00:39:13'),
(30, 30, 'ADIDAS-WB-010', 90.00, NULL, 20, NULL, NULL, 1, '2025-09-06 00:39:14', '2025-09-06 00:39:14'),
(31, 31, 'ADIDAS-AL-011', 50.00, NULL, 40, NULL, NULL, 1, '2025-09-06 00:39:15', '2025-09-06 00:39:15'),
(32, 32, 'ADIDAS-SB-012', 35.00, 28.00, 45, NULL, NULL, 1, '2025-09-06 00:39:16', '2025-09-06 00:39:16'),
(33, 33, 'ADIDAS-CTT-013', 25.00, NULL, 50, NULL, NULL, 1, '2025-09-06 00:39:17', '2025-09-06 00:39:17'),
(34, 34, 'ADIDAS-AS-014', 30.00, 24.00, 35, NULL, NULL, 1, '2025-09-06 00:39:18', '2025-09-06 00:39:18'),
(35, 35, 'ADIDAS-HEF-015', 65.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:39:20', '2025-09-06 00:39:20'),
(36, 36, 'ADIDAS-CS-016', 18.00, NULL, 80, NULL, NULL, 1, '2025-09-06 00:39:21', '2025-09-06 00:39:21'),
(37, 37, 'ADIDAS-TC-017', 28.00, 22.40, 40, NULL, NULL, 1, '2025-09-06 00:39:22', '2025-09-06 00:39:22'),
(38, 38, 'ADIDAS-GB-018', 45.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:39:23', '2025-09-06 00:39:23'),
(39, 39, 'ADIDAS-WB-019', 22.00, 17.60, 50, NULL, NULL, 1, '2025-09-06 00:39:23', '2025-09-06 00:39:23'),
(40, 40, 'ADIDAS-HB-020', 15.00, NULL, 70, NULL, NULL, 1, '2025-09-06 00:39:24', '2025-09-06 00:39:24'),
(41, 41, 'ZARA-RM-001', 45.00, 36.00, 30, NULL, NULL, 1, '2025-09-06 00:39:24', '2025-09-06 00:39:24'),
(42, 42, 'ZARA-BF-002', 65.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:39:25', '2025-09-06 00:39:25'),
(43, 43, 'ZARA-JS-003', 35.00, 28.00, 40, NULL, NULL, 1, '2025-09-06 00:39:26', '2025-09-06 00:39:26'),
(44, 44, 'ZARA-TB-004', 25.00, NULL, 35, NULL, NULL, 1, '2025-09-06 00:39:27', '2025-09-06 00:39:27'),
(45, 45, 'ZARA-PTH-005', 40.00, 32.00, 20, NULL, NULL, 1, '2025-09-06 00:39:28', '2025-09-06 00:39:28'),
(46, 46, 'ZARA-CO-006', 35.00, NULL, 40, NULL, NULL, 1, '2025-09-06 00:39:29', '2025-09-06 00:39:29'),
(47, 47, 'ZARA-PC-007', 45.00, 36.00, 30, NULL, NULL, 1, '2025-09-06 00:39:30', '2025-09-06 00:39:30'),
(48, 48, 'ZARA-TB-008', 15.00, NULL, 50, NULL, NULL, 1, '2025-09-06 00:39:31', '2025-09-06 00:39:31'),
(49, 49, 'ZARA-VD-009', 55.00, 44.00, 25, NULL, NULL, 1, '2025-09-06 00:39:32', '2025-09-06 00:39:32'),
(50, 50, 'ZARA-SC-010', 30.00, NULL, 35, NULL, NULL, 1, '2025-09-06 00:39:33', '2025-09-06 00:39:33'),
(63, 63, 'HM-JM-003', 40.00, 32.00, 25, NULL, NULL, 1, '2025-09-06 00:39:44', '2025-09-06 00:39:44'),
(65, 65, 'HM-PTH-005', 45.00, 36.00, 15, NULL, NULL, 1, '2025-09-06 00:39:46', '2025-09-06 00:39:46'),
(71, 71, 'HM-RF-011', 18.00, 14.40, 30, NULL, NULL, 1, '2025-09-06 00:39:52', '2025-09-06 00:39:52'),
(72, 72, 'HM-TG-012', 10.00, NULL, 40, NULL, NULL, 1, '2025-09-06 00:39:53', '2025-09-06 00:39:53'),
(73, 73, 'HM-PE-013', 15.00, 12.00, 35, NULL, NULL, 1, '2025-09-06 00:39:54', '2025-09-06 00:39:54'),
(74, 74, 'HM-VE-014', 20.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:39:55', '2025-09-06 00:39:55'),
(75, 75, 'HM-SE-015', 12.00, 9.60, 45, NULL, NULL, 1, '2025-09-06 00:39:56', '2025-09-06 00:39:56'),
(76, 76, 'HM-SAD-016', 25.00, NULL, 30, NULL, NULL, 1, '2025-09-06 00:39:57', '2025-09-06 00:39:57'),
(77, 77, 'HM-B-017', 12.00, 9.60, 50, NULL, NULL, 1, '2025-09-06 00:39:57', '2025-09-06 00:39:57'),
(78, 78, 'HM-E-018', 20.00, NULL, 35, NULL, NULL, 1, '2025-09-06 00:39:58', '2025-09-06 00:39:58'),
(79, 79, 'HM-C-019', 15.00, 12.00, 40, NULL, NULL, 1, '2025-09-06 00:39:59', '2025-09-06 00:39:59'),
(80, 80, 'HM-CH-020', 18.00, NULL, 25, NULL, NULL, 1, '2025-09-06 00:39:59', '2025-09-06 00:39:59'),
(101, 1, 'NIKE-AM270-BLANC-40', 150.00, NULL, 15, NULL, NULL, 1, '2025-09-06 00:42:09', '2025-09-06 00:42:09'),
(102, 1, 'NIKE-AM270-BLANC-41', 150.00, NULL, 20, NULL, NULL, 1, '2025-09-06 00:42:10', '2025-09-06 00:42:10'),
(103, 1, 'NIKE-AM270-BLANC-43', 150.00, NULL, 18, NULL, NULL, 1, '2025-09-06 00:42:11', '2025-09-06 00:42:11'),
(104, 1, 'NIKE-AM270-ROUGE-40', 160.00, NULL, 12, NULL, NULL, 1, '2025-09-06 00:42:11', '2025-09-06 00:42:11'),
(105, 1, 'NIKE-AM270-ROUGE-41', 160.00, NULL, 16, NULL, NULL, 1, '2025-09-06 00:42:12', '2025-09-06 00:42:12'),
(106, 1, 'NIKE-AM270-BLEU-41', 155.00, NULL, 10, NULL, NULL, 1, '2025-09-06 00:42:12', '2025-09-06 00:42:12'),
(107, 1, 'NIKE-AM270-BLEU-44', 155.00, NULL, 8, NULL, NULL, 1, '2025-09-06 00:42:13', '2025-09-06 00:42:13');

-- --------------------------------------------------------

--
-- Table structure for table `rdv`
--

CREATE TABLE `rdv` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receptions`
--

CREATE TABLE `receptions` (
  `id` int(11) NOT NULL,
  `commande_achat_id` int(11) NOT NULL,
  `numero_reception` varchar(50) NOT NULL COMMENT 'Unique ex: GRN-2025-0001',
  `date_reception` datetime NOT NULL DEFAULT current_timestamp(),
  `statut` enum('brouillon','validee') NOT NULL DEFAULT 'brouillon',
  `recu_par` varchar(100) DEFAULT NULL COMMENT 'Saisie libre (ou operateur)',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Réceptions d''achat';

-- --------------------------------------------------------

--
-- Table structure for table `receptions_details`
--

CREATE TABLE `receptions_details` (
  `id` int(11) NOT NULL,
  `reception_id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `quantite_recue` int(11) NOT NULL,
  `prix_unitaire_achat` int(11) NOT NULL DEFAULT 0,
  `lot_numero` varchar(100) DEFAULT NULL,
  `date_peremption` date DEFAULT NULL,
  `entrepot_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lignes de réception';

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sous_categories`
--

CREATE TABLE `sous_categories` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sous_categories`
--

INSERT INTO `sous_categories` (`id`, `nom`, `description`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Chaussures de Sport', 'Chaussures de running, basketball, football et fitness', '/uploads/sous_categories/nike-chaussures.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(2, 'Vêtements Homme', 'T-shirts, shorts, survêtements et accessoires pour homme', '/uploads/sous_categories/nike-homme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(3, 'Vêtements Femme', 'Leggings, tops, shorts et vêtements de sport pour femme', '/uploads/sous_categories/nike-femme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(5, 'Chaussures de Sport', 'Chaussures de running, football et lifestyle', '/uploads/sous_categories/adidas-chaussures.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(6, 'Vêtements Homme', 'T-shirts, shorts, survêtements et accessoires pour homme', '/uploads/sous_categories/adidas-homme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(7, 'Vêtements Femme', 'Leggings, tops, shorts et vêtements de sport pour femme', '/uploads/sous_categories/adidas-femme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(8, 'Accessoires', 'Sacs, chaussettes, casquettes et équipements sportifs', '/uploads/sous_categories/1757345526512.png', '2025-09-05 20:24:38', '2025-09-08 15:32:07'),
(9, 'Femme', 'Vêtements, chaussures et accessoires pour femme', '/uploads/sous_categories/zara-femme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(10, 'Homme', 'Vêtements, chaussures et accessoires pour homme', '/uploads/sous_categories/zara-homme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(13, 'Femme', 'Vêtements, chaussures et accessoires pour femme', '/uploads/sous_categories/hm-femme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(15, 'Enfant', 'Vêtements et accessoires pour enfants', '/uploads/sous_categories/hm-enfant.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(16, 'Accessoires', 'Sacs, bijoux, chaussures et accessoires de mode', '/uploads/sous_categories/hm-accessoires.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(17, 'Femme', 'Vêtements basiques et fonctionnels pour femme', '/uploads/sous_categories/uniqlo-femme.jpg', '2025-09-05 20:24:38', '2025-09-05 20:24:38'),
(21, 'Cache coeur', 'description des cache coeurs', '/uploads/sous_categories/1757345314083.jpeg', '2025-09-08 15:28:35', '2025-09-08 15:28:35');

-- --------------------------------------------------------

--
-- Table structure for table `stocks_courants`
--

CREATE TABLE `stocks_courants` (
  `id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `entrepot_id` int(11) DEFAULT NULL,
  `quantite_disponible` int(11) NOT NULL DEFAULT 0,
  `cout_moyen` int(11) DEFAULT NULL COMMENT 'FCFA (optionnel)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quantités courantes et coût moyen';

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `adresse` varchar(50) NOT NULL,
  `souvenir` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL,
  `role` enum('cassier','admin','superadmin') NOT NULL DEFAULT 'cassier',
  `status` enum('active','suspended') NOT NULL DEFAULT 'active',
  `must_change_password` tinyint(1) NOT NULL DEFAULT 0,
  `login_failed_count` int(11) NOT NULL DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `last_login_user_agent` varchar(255) DEFAULT NULL,
  `allowed_login_start` time DEFAULT NULL,
  `allowed_login_end` time DEFAULT NULL,
  `timezone` varchar(64) DEFAULT 'Africa/Dakar'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `telephone`, `adresse`, `souvenir`, `email`, `password_hash`, `created_at`, `updated_at`, `role`, `status`, `must_change_password`, `login_failed_count`, `locked_until`, `last_login_at`, `last_login_ip`, `last_login_user_agent`, `allowed_login_start`, `allowed_login_end`, `timezone`) VALUES
(1, 'Cassier', 'User', '', '', '', 'cassier@example.com', '$2a$10$XyB9JfXo9yH7qgq3d9oI7OJn8qJ5o6x8mUQm9aZyq0fY7cT8eYy6K', '2025-09-08 11:38:04', '2025-09-08 11:36:19', 'cassier', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Africa/Dakar'),
(2, 'Admin', 'User', '', '', '', 'admin@example.com', '$2a$10$XyB9JfXo9yH7qgq3d9oI7OJn8qJ5o6x8mUQm9aZyq0fY7cT8eYy6K', '2025-09-08 11:36:19', '2025-09-08 11:36:19', 'admin', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Africa/Dakar'),
(3, 'Super', 'Admin', '', '', '', 'superadmin@example.com', '$2a$10$XyB9JfXo9yH7qgq3d9oI7OJn8qJ5o6x8mUQm9aZyq0fY7cT8eYy6K', '2025-09-08 11:36:19', '2025-09-08 11:36:19', 'superadmin', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Africa/Dakar'),
(4, 'Super', 'Admin', '', '', '', 'superadmin@example.com', '$2b$10$.pVz/gp2VTSKEn4akHSbXeSvC5yBmayCPhsblmGWgIRK/djk05ERa', '2025-09-08 12:43:39', '2025-09-08 12:43:39', 'superadmin', 'active', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'Africa/Dakar');

-- --------------------------------------------------------

--
-- Table structure for table `user_access_hours`
--

CREATE TABLE `user_access_hours` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `granted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variante_attributs`
--

CREATE TABLE `variante_attributs` (
  `id` int(11) NOT NULL,
  `variante_id` int(11) NOT NULL,
  `attribut_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variante_attributs`
--

INSERT INTO `variante_attributs` (`id`, `variante_id`, `attribut_id`, `created_at`) VALUES
(1, 1, 69, '2025-09-06 00:38:45'),
(2, 1, 23, '2025-09-06 00:38:45'),
(3, 2, 2, '2025-09-06 00:38:46'),
(4, 2, 22, '2025-09-06 00:38:46'),
(5, 3, 70, '2025-09-06 00:38:47'),
(6, 3, 24, '2025-09-06 00:38:47'),
(7, 4, 71, '2025-09-06 00:38:49'),
(8, 4, 21, '2025-09-06 00:38:49'),
(9, 5, 72, '2025-09-06 00:38:50'),
(10, 5, 25, '2025-09-06 00:38:50'),
(11, 6, 1, '2025-09-06 00:38:51'),
(12, 6, 14, '2025-09-06 00:38:51'),
(13, 7, 6, '2025-09-06 00:38:52'),
(14, 7, 13, '2025-09-06 00:38:52'),
(15, 8, 4, '2025-09-06 00:38:54'),
(16, 8, 15, '2025-09-06 00:38:54'),
(17, 9, 1, '2025-09-06 00:38:54'),
(18, 9, 14, '2025-09-06 00:38:54'),
(19, 10, 5, '2025-09-06 00:38:55'),
(20, 10, 13, '2025-09-06 00:38:56'),
(21, 11, 1, '2025-09-06 00:38:56'),
(22, 11, 13, '2025-09-06 00:38:56'),
(23, 12, 7, '2025-09-06 00:38:57'),
(24, 12, 12, '2025-09-06 00:38:57'),
(25, 13, 2, '2025-09-06 00:38:59'),
(26, 13, 14, '2025-09-06 00:38:59'),
(27, 14, 6, '2025-09-06 00:39:00'),
(28, 14, 13, '2025-09-06 00:39:00'),
(29, 15, 8, '2025-09-06 00:39:01'),
(30, 15, 12, '2025-09-06 00:39:01'),
(36, 21, 74, '2025-09-06 00:39:05'),
(37, 21, 23, '2025-09-06 00:39:05'),
(38, 22, 75, '2025-09-06 00:39:06'),
(39, 22, 22, '2025-09-06 00:39:06'),
(40, 23, 76, '2025-09-06 00:39:07'),
(41, 23, 24, '2025-09-06 00:39:08'),
(42, 24, 4, '2025-09-06 00:39:08'),
(43, 24, 21, '2025-09-06 00:39:08'),
(44, 25, 77, '2025-09-06 00:39:09'),
(45, 25, 25, '2025-09-06 00:39:09'),
(46, 26, 1, '2025-09-06 00:39:10'),
(47, 26, 14, '2025-09-06 00:39:11'),
(48, 27, 2, '2025-09-06 00:39:11'),
(49, 27, 13, '2025-09-06 00:39:11'),
(50, 28, 6, '2025-09-06 00:39:12'),
(51, 28, 15, '2025-09-06 00:39:12'),
(52, 29, 1, '2025-09-06 00:39:13'),
(53, 29, 14, '2025-09-06 00:39:13'),
(54, 30, 4, '2025-09-06 00:39:14'),
(55, 30, 13, '2025-09-06 00:39:15'),
(56, 31, 7, '2025-09-06 00:39:15'),
(57, 31, 13, '2025-09-06 00:39:16'),
(58, 32, 1, '2025-09-06 00:39:16'),
(59, 32, 12, '2025-09-06 00:39:17'),
(60, 33, 2, '2025-09-06 00:39:18'),
(61, 33, 14, '2025-09-06 00:39:18'),
(62, 34, 4, '2025-09-06 00:39:20'),
(63, 34, 13, '2025-09-06 00:39:20'),
(64, 35, 8, '2025-09-06 00:39:21'),
(65, 35, 12, '2025-09-06 00:39:21'),
(66, 36, 2, '2025-09-06 00:39:21'),
(67, 37, 1, '2025-09-06 00:39:22'),
(68, 38, 1, '2025-09-06 00:39:23'),
(69, 39, 73, '2025-09-06 00:39:23'),
(70, 40, 2, '2025-09-06 00:39:24'),
(71, 41, 1, '2025-09-06 00:39:25'),
(72, 41, 13, '2025-09-06 00:39:25'),
(73, 42, 78, '2025-09-06 00:39:26'),
(74, 42, 14, '2025-09-06 00:39:26'),
(75, 43, 4, '2025-09-06 00:39:27'),
(76, 43, 12, '2025-09-06 00:39:27'),
(77, 44, 2, '2025-09-06 00:39:28'),
(78, 44, 13, '2025-09-06 00:39:28'),
(79, 45, 6, '2025-09-06 00:39:29'),
(80, 45, 14, '2025-09-06 00:39:29'),
(81, 46, 2, '2025-09-06 00:39:29'),
(82, 46, 14, '2025-09-06 00:39:30'),
(83, 47, 78, '2025-09-06 00:39:30'),
(84, 47, 13, '2025-09-06 00:39:30'),
(85, 48, 6, '2025-09-06 00:39:31'),
(86, 48, 15, '2025-09-06 00:39:32'),
(87, 49, 4, '2025-09-06 00:39:33'),
(88, 49, 14, '2025-09-06 00:39:33'),
(89, 50, 5, '2025-09-06 00:39:34'),
(90, 50, 13, '2025-09-06 00:39:34'),
(110, 63, 4, '2025-09-06 00:39:45'),
(111, 63, 12, '2025-09-06 00:39:45'),
(114, 65, 1, '2025-09-06 00:39:47'),
(115, 65, 14, '2025-09-06 00:39:47'),
(126, 71, 10, '2025-09-06 00:39:52'),
(127, 71, 79, '2025-09-06 00:39:53'),
(128, 72, 3, '2025-09-06 00:39:53'),
(129, 72, 80, '2025-09-06 00:39:54'),
(130, 73, 4, '2025-09-06 00:39:54'),
(131, 73, 81, '2025-09-06 00:39:54'),
(132, 74, 5, '2025-09-06 00:39:55'),
(133, 74, 79, '2025-09-06 00:39:55'),
(134, 75, 9, '2025-09-06 00:39:56'),
(135, 75, 80, '2025-09-06 00:39:57'),
(136, 76, 1, '2025-09-06 00:39:57'),
(137, 77, 82, '2025-09-06 00:39:58'),
(138, 78, 6, '2025-09-06 00:39:58'),
(139, 79, 83, '2025-09-06 00:39:59'),
(140, 80, 78, '2025-09-06 00:40:00'),
(176, 101, 2, '2025-09-06 00:42:10'),
(177, 101, 21, '2025-09-06 00:42:10'),
(178, 102, 2, '2025-09-06 00:42:10'),
(179, 102, 22, '2025-09-06 00:42:10'),
(180, 103, 2, '2025-09-06 00:42:11'),
(181, 103, 24, '2025-09-06 00:42:11'),
(182, 104, 3, '2025-09-06 00:42:11'),
(183, 104, 21, '2025-09-06 00:42:11'),
(184, 105, 3, '2025-09-06 00:42:12'),
(185, 105, 22, '2025-09-06 00:42:12'),
(186, 106, 4, '2025-09-06 00:42:12'),
(187, 106, 22, '2025-09-06 00:42:13'),
(188, 107, 4, '2025-09-06 00:42:13'),
(189, 107, 25, '2025-09-06 00:42:13');

-- --------------------------------------------------------

--
-- Table structure for table `wellness`
--

CREATE TABLE `wellness` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `prix` decimal(10,0) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zone`
--

CREATE TABLE `zone` (
  `id` int(11) NOT NULL,
  `code_zone` varchar(20) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ajustements_stock`
--
ALTER TABLE `ajustements_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_ajustement_numero` (`numero_ajustement`),
  ADD KEY `idx_ajustement_date` (`date_ajustement`),
  ADD KEY `idx_ajustement_statut` (`statut`),
  ADD KEY `idx_ajustement_operateur` (`operateur_id`);

--
-- Indexes for table `ajustements_stock_details`
--
ALTER TABLE `ajustements_stock_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asd_ajustement` (`ajustement_id`),
  ADD KEY `idx_asd_produit` (`produit_id`),
  ADD KEY `idx_asd_variante` (`variante_id`);

--
-- Indexes for table `attributs`
--
ALTER TABLE `attributs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attribut` (`nom`,`type`,`valeur`);

--
-- Indexes for table `auth_login_logs`
--
ALTER TABLE `auth_login_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_auth_login_logs_user_created` (`user_id`,`created_at`);

--
-- Indexes for table `catégorie`
--
ALTER TABLE `catégorie`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_commande` (`numero_commande`),
  ADD KEY `idx_client_id` (`client_id`),
  ADD KEY `idx_operateur_id` (`operateur_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_etape_actuelle` (`etape_actuelle`),
  ADD KEY `idx_date_commande` (`date_commande`),
  ADD KEY `idx_date_livraison_prevue` (`date_livraison_prevue`),
  ADD KEY `idx_montant_total` (`montant_total`),
  ADD KEY `idx_mode_paiement_id` (`mode_paiement_id`),
  ADD KEY `idx_type_livraison` (`type_livraison`),
  ADD KEY `idx_source_commande` (`source_commande`),
  ADD KEY `idx_ville_livraison` (`ville_livraison`),
  ADD KEY `idx_numero_suivi` (`numero_suivi`),
  ADD KEY `fk_commandes_created_by` (`created_by`),
  ADD KEY `fk_commandes_updated_by` (`updated_by`);

--
-- Indexes for table `commandes_achat`
--
ALTER TABLE `commandes_achat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_commandes_achat_numero` (`numero_achat`),
  ADD KEY `idx_ca_statut` (`statut`),
  ADD KEY `idx_ca_date_commande` (`date_commande`);

--
-- Indexes for table `commandes_achat_details`
--
ALTER TABLE `commandes_achat_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cad_commande` (`commande_achat_id`),
  ADD KEY `idx_cad_produit` (`produit_id`),
  ADD KEY `idx_cad_variante` (`variante_id`);

--
-- Indexes for table `commande_details`
--
ALTER TABLE `commande_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commande_details_commandes` (`commande_id`),
  ADD KEY `fk_commande_details_produits` (`produit_id`);

--
-- Indexes for table `favoris`
--
ALTER TABLE `favoris`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favori` (`client_id`,`produit_id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Indexes for table `inventaires_cycliques`
--
ALTER TABLE `inventaires_cycliques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_invc_statut` (`statut`),
  ADD KEY `idx_invc_date_debut` (`date_debut`);

--
-- Indexes for table `inventaires_cycliques_details`
--
ALTER TABLE `inventaires_cycliques_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_invd_inventaire` (`inventaire_id`),
  ADD KEY `idx_invd_produit` (`produit_id`),
  ADD KEY `idx_invd_variante` (`variante_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`client_id`,`produit_id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Indexes for table `marques`
--
ALTER TABLE `marques`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modes_paiement`
--
ALTER TABLE `modes_paiement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_paiement` (`code_paiement`),
  ADD UNIQUE KEY `code` (`code_paiement`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_categorie` (`categorie`),
  ADD KEY `idx_actif` (`actif`),
  ADD KEY `idx_ordre_affichage` (`ordre_affichage`),
  ADD KEY `fk_modes_paiement_created_by` (`created_by`),
  ADD KEY `fk_modes_paiement_updated_by` (`updated_by`);

--
-- Indexes for table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ms_produit` (`produit_id`),
  ADD KEY `idx_ms_variante` (`variante_id`),
  ADD KEY `idx_ms_type` (`type`),
  ADD KEY `idx_ms_date` (`date_mouvement`);

--
-- Indexes for table `operateur`
--
ALTER TABLE `operateur`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paiements`
--
ALTER TABLE `paiements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_transaction` (`numero_transaction`),
  ADD KEY `idx_client_id` (`client_id`),
  ADD KEY `idx_commande_id` (`commande_id`),
  ADD KEY `idx_operateur_id` (`operateur_id`),
  ADD KEY `idx_type_transaction` (`type_transaction`),
  ADD KEY `idx_sens_transaction` (`sens_transaction`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_mode_paiement_id` (`mode_paiement_id`),
  ADD KEY `idx_methode_paiement` (`methode_paiement`),
  ADD KEY `idx_date_creation` (`created_at`),
  ADD KEY `idx_montant` (`montant`),
  ADD KEY `idx_reference_externe` (`reference_externe`),
  ADD KEY `idx_transaction_externe` (`transaction_id_externe`),
  ADD KEY `fk_paiements_valide_par` (`valide_par`),
  ADD KEY `fk_paiements_created_by` (`created_by`),
  ADD KEY `fk_paiements_updated_by` (`updated_by`);

--
-- Indexes for table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token_hash` (`token_hash`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `marque_id` (`marque_id`),
  ADD KEY `sous_categorie_id` (`sous_categorie_id`),
  ADD KEY `collection_id` (`collection_id`);

--
-- Indexes for table `produit_images`
--
ALTER TABLE `produit_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Indexes for table `produit_variantes`
--
ALTER TABLE `produit_variantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_sku` (`sku`),
  ADD KEY `fk_produit_variante` (`produit_id`);

--
-- Indexes for table `rdv`
--
ALTER TABLE `rdv`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rdv` (`agent_id`,`date`,`heure`);

--
-- Indexes for table `receptions`
--
ALTER TABLE `receptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_receptions_numero` (`numero_reception`),
  ADD KEY `idx_receptions_commande` (`commande_achat_id`),
  ADD KEY `idx_receptions_date` (`date_reception`),
  ADD KEY `idx_receptions_statut` (`statut`);

--
-- Indexes for table `receptions_details`
--
ALTER TABLE `receptions_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rd_reception` (`reception_id`),
  ADD KEY `idx_rd_produit` (`produit_id`),
  ADD KEY `idx_rd_variante` (`variante_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `sous_categories`
--
ALTER TABLE `sous_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks_courants`
--
ALTER TABLE `stocks_courants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_stock_unique` (`produit_id`,`variante_id`,`entrepot_id`),
  ADD KEY `idx_sc_produit` (`produit_id`),
  ADD KEY `idx_sc_variante` (`variante_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_locked_until` (`locked_until`);

--
-- Indexes for table `user_access_hours`
--
ALTER TABLE `user_access_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_uah_user_day` (`user_id`,`day_of_week`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`user_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `variante_attributs`
--
ALTER TABLE `variante_attributs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_variante_attribut` (`variante_id`,`attribut_id`),
  ADD KEY `fk_variante_attr_variante` (`variante_id`),
  ADD KEY `fk_variante_attr_attribut` (`attribut_id`);

--
-- Indexes for table `wellness`
--
ALTER TABLE `wellness`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zone`
--
ALTER TABLE `zone`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ajustements_stock`
--
ALTER TABLE `ajustements_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ajustements_stock_details`
--
ALTER TABLE `ajustements_stock_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attributs`
--
ALTER TABLE `attributs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `auth_login_logs`
--
ALTER TABLE `auth_login_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `catégorie`
--
ALTER TABLE `catégorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `commandes_achat`
--
ALTER TABLE `commandes_achat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `commandes_achat_details`
--
ALTER TABLE `commandes_achat_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `commande_details`
--
ALTER TABLE `commande_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `favoris`
--
ALTER TABLE `favoris`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventaires_cycliques`
--
ALTER TABLE `inventaires_cycliques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventaires_cycliques_details`
--
ALTER TABLE `inventaires_cycliques_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marques`
--
ALTER TABLE `marques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `modes_paiement`
--
ALTER TABLE `modes_paiement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `operateur`
--
ALTER TABLE `operateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paiements`
--
ALTER TABLE `paiements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `panier`
--
ALTER TABLE `panier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `produits`
--
ALTER TABLE `produits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `produit_images`
--
ALTER TABLE `produit_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `produit_variantes`
--
ALTER TABLE `produit_variantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `rdv`
--
ALTER TABLE `rdv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `receptions`
--
ALTER TABLE `receptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `receptions_details`
--
ALTER TABLE `receptions_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sous_categories`
--
ALTER TABLE `sous_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `stocks_courants`
--
ALTER TABLE `stocks_courants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_access_hours`
--
ALTER TABLE `user_access_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `variante_attributs`
--
ALTER TABLE `variante_attributs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT for table `wellness`
--
ALTER TABLE `wellness`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone`
--
ALTER TABLE `zone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ajustements_stock`
--
ALTER TABLE `ajustements_stock`
  ADD CONSTRAINT `fk_ajustement_operateur` FOREIGN KEY (`operateur_id`) REFERENCES `operateur` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ajustements_stock_details`
--
ALTER TABLE `ajustements_stock_details`
  ADD CONSTRAINT `fk_asd_ajustement` FOREIGN KEY (`ajustement_id`) REFERENCES `ajustements_stock` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_asd_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_asd_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `auth_login_logs`
--
ALTER TABLE `auth_login_logs`
  ADD CONSTRAINT `fk_auth_login_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `fk_commandes_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commandes_created_by` FOREIGN KEY (`created_by`) REFERENCES `operateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_commandes_mode_paiement` FOREIGN KEY (`mode_paiement_id`) REFERENCES `modes_paiement` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_commandes_operateur` FOREIGN KEY (`operateur_id`) REFERENCES `operateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_commandes_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `operateur` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `commandes_achat_details`
--
ALTER TABLE `commandes_achat_details`
  ADD CONSTRAINT `fk_cad_commande` FOREIGN KEY (`commande_achat_id`) REFERENCES `commandes_achat` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cad_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cad_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `commande_details`
--
ALTER TABLE `commande_details`
  ADD CONSTRAINT `fk_commande_details_produits` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`);

--
-- Constraints for table `favoris`
--
ALTER TABLE `favoris`
  ADD CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventaires_cycliques_details`
--
ALTER TABLE `inventaires_cycliques_details`
  ADD CONSTRAINT `fk_invd_inventaire` FOREIGN KEY (`inventaire_id`) REFERENCES `inventaires_cycliques` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_invd_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_invd_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `modes_paiement`
--
ALTER TABLE `modes_paiement`
  ADD CONSTRAINT `fk_modes_paiement_created_by` FOREIGN KEY (`created_by`) REFERENCES `operateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_modes_paiement_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `operateur` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD CONSTRAINT `fk_ms_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ms_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `paiements`
--
ALTER TABLE `paiements`
  ADD CONSTRAINT `fk_paiements_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_paiements_created_by` FOREIGN KEY (`created_by`) REFERENCES `operateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_paiements_mode_paiement` FOREIGN KEY (`mode_paiement_id`) REFERENCES `modes_paiement` (`id`),
  ADD CONSTRAINT `fk_paiements_operateur` FOREIGN KEY (`operateur_id`) REFERENCES `operateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_paiements_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `operateur` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_paiements_valide_par` FOREIGN KEY (`valide_par`) REFERENCES `operateur` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `produits_ibfk_1` FOREIGN KEY (`marque_id`) REFERENCES `marques` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produits_ibfk_2` FOREIGN KEY (`sous_categorie_id`) REFERENCES `sous_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produits_ibfk_3` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `produit_images`
--
ALTER TABLE `produit_images`
  ADD CONSTRAINT `produit_images_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produit_variantes`
--
ALTER TABLE `produit_variantes`
  ADD CONSTRAINT `fk_produit_variante` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rdv`
--
ALTER TABLE `rdv`
  ADD CONSTRAINT `fk_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receptions`
--
ALTER TABLE `receptions`
  ADD CONSTRAINT `fk_receptions_commande` FOREIGN KEY (`commande_achat_id`) REFERENCES `commandes_achat` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receptions_details`
--
ALTER TABLE `receptions_details`
  ADD CONSTRAINT `fk_rd_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rd_reception` FOREIGN KEY (`reception_id`) REFERENCES `receptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rd_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stocks_courants`
--
ALTER TABLE `stocks_courants`
  ADD CONSTRAINT `fk_sc_produit` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_sc_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_access_hours`
--
ALTER TABLE `user_access_hours`
  ADD CONSTRAINT `fk_uah_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variante_attributs`
--
ALTER TABLE `variante_attributs`
  ADD CONSTRAINT `fk_variante_attr_attribut` FOREIGN KEY (`attribut_id`) REFERENCES `attributs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_variante_attr_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
