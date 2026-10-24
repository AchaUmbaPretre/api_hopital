/**
 * DÉTECTION DES COLONNES RDC (migration 001_rdc_metier.sql) —
 * dégradation gracieuse : le backend fonctionne IDENTIQUEMENT sur une
 * base migrée (extras persistés) ou non (extras ignorés, comportement
 * hérité intact).
 *
 * Au PREMIER accès, la liste des colonnes de la table est lue dans
 * information_schema et mise en cache (une seule requête par table et
 * par process). Tout échec (base indisponible, droits insuffisants)
 * renvoie un ensemble VIDE → les colonnes RDC sont considérées
 * absentes : l'application héritée n'est JAMAIS cassée par cette
 * utilitaire.
 */

const pool = require('../config/db.config');

/** Cache : table -> Promise<Set<nom de colonne>> */
const cacheColonnes = new Map();

function requeteAsync(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

/**
 * Ensemble des colonnes d'une table (mis en cache).
 * @returns {Promise<Set<string>>} vide si la lecture échoue.
 */
function colonnesDe(table) {
  if (cacheColonnes.has(table)) return cacheColonnes.get(table);
  const promesse = requeteAsync(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table],
  )
    .then((lignes) => new Set(lignes.map((l) => l.COLUMN_NAME)))
    .catch((err) => {
      console.warn(`[rdcColumns] colonnes de « ${table} » non lues — colonnes RDC ignorées :`, err.message);
      return new Set();
    });
  cacheColonnes.set(table, promesse);
  return promesse;
}

/** La colonne optionnelle existe-t-elle (migration appliquée) ? */
async function colonneExiste(table, colonne) {
  const colonnes = await colonnesDe(table);
  return colonnes.has(colonne);
}

/**
 * Colonnes RDC présentes sur `factures` (mode, motif, autorise_par,
 * facture_locale, dossier_patient). Renvoie la LISTE des colonnes
 * réellement disponibles — vide si la migration n'est pas passée.
 */
async function colonnesFacturesRdc() {
  const colonnes = await colonnesDe('factures');
  const attendues = ['mode', 'motif', 'autorise_par', 'facture_locale', 'dossier_patient'];
  return attendues.filter((c) => colonnes.has(c));
}

/** Paiements : colonne d'audit bidevise `taux_fc_usd`. */
async function paiementTauxDisponible() {
  return colonneExiste('paiements', 'taux_fc_usd');
}

/** Patients : colonne `dossier` (référence carnet RDC). */
async function dossierPatientDisponible() {
  return colonneExiste('patient', 'dossier');
}

/** Médicaments : colonnes RDC (classe_therepeutique, seuil). */
async function colonnesMedicamentRdc() {
  const colonnes = await colonnesDe('medicament');
  return {
    classe: colonnes.has('classe_therepeutique'),
    seuil: colonnes.has('seuil'),
  };
}

/** Table `triage` (CREATE TABLE de la migration) existe-t-elle ? */
async function tableTriageDisponible() {
  const colonnes = await colonnesDe('triage');
  return colonnes.has('id_triage');
}

/** Table d'idempotence disponible (middleware de dédupe). */
async function tableIdempotenceDisponible() {
  const colonnes = await colonnesDe('idempotence_cles');
  return colonnes.has('cle');
}

module.exports = {
  colonnesDe,
  colonneExiste,
  colonnesFacturesRdc,
  paiementTauxDisponible,
  dossierPatientDisponible,
  colonnesMedicamentRdc,
  tableTriageDisponible,
  tableIdempotenceDisponible,
};
