-- Script pour supprimer les tables liées aux achats, mouvements et ajustements
-- ATTENTION: Ce script supprime définitivement les données !

-- Supprimer les contraintes de clés étrangères d'abord
ALTER TABLE receptions_details DROP FOREIGN KEY IF EXISTS fk_rd_reception;
ALTER TABLE receptions DROP FOREIGN KEY IF EXISTS fk_receptions_commande;
ALTER TABLE commandes_achat_details DROP FOREIGN KEY IF EXISTS fk_cad_commande;
ALTER TABLE ajustements_stock_details DROP FOREIGN KEY IF EXISTS fk_asd_ajustement;

-- Supprimer les tables
DROP TABLE IF EXISTS receptions_details;
DROP TABLE IF EXISTS receptions;
DROP TABLE IF EXISTS commandes_achat_details;
DROP TABLE IF EXISTS commandes_achat;
DROP TABLE IF EXISTS ajustements_stock_details;
DROP TABLE IF EXISTS ajustements_stock;
DROP TABLE IF EXISTS mouvements_stock;

-- Vérifier que les tables ont été supprimées
SHOW TABLES LIKE '%achat%';
SHOW TABLES LIKE '%ajustement%';
SHOW TABLES LIKE '%mouvement%';
SHOW TABLES LIKE '%reception%';
