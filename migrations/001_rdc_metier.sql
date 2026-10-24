-- ============================================================================
-- 001_rdc_metier.sql — MIGRATION ADDITIVE pour les règles métier RDC
-- (HGR — brief RDC : bidevise FC/USD, mutuelles, exonérations, urgence
--  vitale, triage 4 niveaux, alternatives thérapeutiques, dossier patient,
--  dédupe d'idempotence).
--
--  SÛRE À RELANCER (IF NOT EXISTS / colonnes gardées) ;
--  100 % ADDITIVE : aucune colonne existante n'est modifiée ni rendue
--  NOT NULL — l'application héritée continue de fonctionner SANS cette
--  migration (les colonnes sont optionnelles et le backend RDC les
--  détecte au démarrage, voir utils/rdcColumns.js).
--
--  Application :
--    mysql -u <USER> -p <BASE> < migrations/001_rdc_metier.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. patient.dossier — référence RDC imprimable « INIT-ANNÉE-N° »
--    (le carnet papier EST le dossier patient en RDC ; le frontend
--    génère la référence et la pousse dans le payload `dossier`).
-- ---------------------------------------------------------------------------
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patient' AND COLUMN_NAME = 'dossier') = 0,
  'ALTER TABLE patient ADD COLUMN dossier VARCHAR(20) NULL,
     ADD INDEX idx_patient_dossier (dossier)',
  'SELECT ''colonne patient.dossier déjà présente'' AS info'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------------
-- 2. paiements.taux_fc_usd — audit bidevise (taux appliqué au moment de
--    l'encaissement ; rend le reçu FC/USD reconstituable a posteriori).
-- ---------------------------------------------------------------------------
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'paiements' AND COLUMN_NAME = 'taux_fc_usd') = 0,
  'ALTER TABLE paiements ADD COLUMN taux_fc_usd DECIMAL(12,4) NULL',
  'SELECT ''colonne paiements.taux_fc_usd déjà présente'' AS info'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------------
-- 3. factures — exceptions financières tracées (arrêté n°1250/2025) :
--    mode (totalite/acompte/exonere/urgence_vitale), motif (exonération /
--    urgence vitale), autorise_par (qui a autorisé la prise en charge
--    sans paiement), facture_locale (référence du reçu REC-… imprimé
--    hors ligne — trace croisée caisse), dossier_patient (référence
--    carnet locale au moment de la facturation).
-- ---------------------------------------------------------------------------
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'factures' AND COLUMN_NAME = 'mode') = 0,
  'ALTER TABLE factures
     ADD COLUMN mode VARCHAR(30) NULL,
     ADD COLUMN motif VARCHAR(255) NULL,
     ADD COLUMN autorise_par VARCHAR(120) NULL,
     ADD COLUMN facture_locale VARCHAR(30) NULL,
     ADD COLUMN dossier_patient VARCHAR(20) NULL,
     ADD INDEX idx_factures_locale (facture_locale)',
  'SELECT ''colonnes factures RDC déjà présentes'' AS info'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------------
-- 4. medicament — alternatives thérapeutiques + seuil d'alerte :
--    classe_therepeutique (base du « remplacer par… » en cas de rupture),
--    seuil (en dessous = alerte « stock bas » orange).
-- ---------------------------------------------------------------------------
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'medicament' AND COLUMN_NAME = 'classe_therepeutique') = 0,
  'ALTER TABLE medicament
     ADD COLUMN classe_therepeutique VARCHAR(120) NULL,
     ADD COLUMN seuil INT NULL',
  'SELECT ''colonnes medicament RDC déjà présentes'' AS info'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ---------------------------------------------------------------------------
-- 5. triage — accueil des urgences, 4 niveaux (Rouge immédiat / Orange
--    ≤ 30 min / Jaune ≤ 2 h / Vert différable) + urgence vitale tracée
--    (prise en charge SANS paiement préalable, arrêté n°1250/2025).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS triage (
  id_triage INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  niveau ENUM('rouge','orange','jaune','vert') NOT NULL,
  motif VARCHAR(255) NULL,
  orientation VARCHAR(120) NULL,
  urgence_vitale TINYINT(1) NOT NULL DEFAULT 0,
  autorise_par VARCHAR(120) NULL,
  motif_autorisation VARCHAR(255) NULL,
  montant_du_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  cree_par VARCHAR(120) NULL,
  date_triage DATETIME NOT NULL,
  INDEX idx_triage_patient (patient_id),
  INDEX idx_triage_date (date_triage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------------
-- 6. mutuelle — 200+ mutuelles volontaires en RDC (~5 USD/mois/adhérent) :
--    organisme, % de couverture, ticket modérateur ; liaison patient
--    (n° adhérent).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mutuelle (
  id_mutuelle INT AUTO_INCREMENT PRIMARY KEY,
  nom_organisme VARCHAR(150) NOT NULL,
  taux_couverture TINYINT UNSIGNED NOT NULL DEFAULT 0,   -- 0-100 %
  ticket_moderateur_pct TINYINT UNSIGNED NULL,           -- optionnel (100 - taux)
  actif TINYINT(1) NOT NULL DEFAULT 1,
  cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS patient_mutuelle (
  id_patient_mutuelle INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  mutuelle_id INT NOT NULL,
  numero_adherent VARCHAR(60) NULL,
  date_affiliation DATE NULL,
  UNIQUE KEY uk_patient_mutuelle (patient_id, mutuelle_id),
  INDEX idx_pm_mutuelle (mutuelle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------------
-- 7. idempotence_cles — dédupe des rejeux offline (le frontend envoie
--    déjà l'en-tête X-Idempotence-Key à chaque mutation ; le middleware
--    middleware/idempotence.middleware.js rejoue la réponse stockée si
--    la clé est connue → zéro doublon après une coupure réseau).
--    `reponse` en TEXT (compatible toutes versions MySQL, le corps est
--    stocké sérialisé) ; les entrées > 48 h sont purgées au passage.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS idempotence_cles (
  cle VARCHAR(128) PRIMARY KEY,
  endpoint VARCHAR(160) NOT NULL,
  statut SMALLINT UNSIGNED NOT NULL,
  reponse TEXT NULL,
  cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Purge des clés de plus de 48 h (sûr à relancer ; le middleware purge
-- aussi à l'insertion, ceci est le filet de la migration).
DELETE FROM idempotence_cles WHERE cree_le < (NOW() - INTERVAL 48 HOUR);
