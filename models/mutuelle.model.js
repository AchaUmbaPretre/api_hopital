const pool = require('../config/db.config');
const { tableMutuelleDisponible } = require('../utils/rdcColumns');

/** Requête en promesse — style callback obligatoire pour lire les
 *  résultats et les insertId du package `mysql`. */
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

/** Garde : la migration 001 a-t-elle créé les tables mutuelle ? */
async function exigerTables() {
  const dispo = await tableMutuelleDisponible();
  if (!dispo) {
    const err = new Error(
      'Tables mutuelle absentes — appliquer migrations/001_rdc_metier.sql (les affectations restent tracées côté frontend)',
    );
    err.status = 501;
    throw err;
  }
}

/**
 * Liste des mutuelles actives (200+ mutuelles volontaires en RDC).
 * Le frontend les propose en <datalist> pour la prise en charge
 * mutuelle (organisme, % de couverture).
 */
const getMutuelles = async () => {
  await exigerTables();
  return queryAsync(
    `SELECT id_mutuelle, nom_organisme, taux_couverture, ticket_moderateur_pct, actif, cree_le
     FROM mutuelle WHERE actif = 1 ORDER BY nom_organisme`,
  );
};

/**
 * Création d'une mutuelle (l'administrateur enregistre un nouvel
 * organisme partenaire). Renvoie insertId (B1).
 */
const createMutuelle = async (nomOrganisme, tauxCouverture, ticketModerateurPct) => {
  await exigerTables();
  const taux = Number(tauxCouverture);
  if (!Number.isFinite(taux) || taux < 0 || taux > 100) {
    const err = new Error('taux_couverture invalide (0-100 attendu)');
    err.status = 400;
    throw err;
  }
  return queryAsync(
    `INSERT INTO mutuelle (nom_organisme, taux_couverture, ticket_moderateur_pct)
     VALUES (?, ?, ?)`,
    [nomOrganisme, Math.round(taux), ticketModerateurPct === undefined || ticketModerateurPct === null
      ? null
      : Math.max(0, Math.min(100, Number(ticketModerateurPct)))],
  );
};

/**
 * Affectations mutuelle d'un patient (n° adhérent, % de couverture).
 */
const getMutuellesPatient = async (idPatient) => {
  await exigerTables();
  return queryAsync(
    `SELECT pm.id_patient_mutuelle, pm.patient_id, pm.mutuelle_id, pm.numero_adherent,
            pm.date_affiliation, m.nom_organisme, m.taux_couverture
     FROM patient_mutuelle pm
     INNER JOIN mutuelle m ON pm.mutuelle_id = m.id_mutuelle
     WHERE pm.patient_id = ?
     ORDER BY pm.id_patient_mutuelle DESC`,
    [idPatient],
  );
};

/**
 * Affectation d'un patient à une mutuelle (UPSERT sur la clé unique
 * (patient_id, mutuelle_id) — une ré-affectation met à jour le n°
 * adhérent au lieu de doubler la ligne).
 */
const affecterMutuellePatient = async (idPatient, idMutuelle, numeroAdherent, dateAffiliation) => {
  await exigerTables();
  if (!Number.isFinite(Number(idPatient)) || !Number.isFinite(Number(idMutuelle))) {
    const err = new Error('patient_id et mutuelle_id (entiers) sont requis');
    err.status = 400;
    throw err;
  }
  return queryAsync(
    `INSERT INTO patient_mutuelle (patient_id, mutuelle_id, numero_adherent, date_affiliation)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE numero_adherent = VALUES(numero_adherent),
                              date_affiliation = VALUES(date_affiliation)`,
    [Number(idPatient), Number(idMutuelle), numeroAdherent ?? null, dateAffiliation ?? null],
  );
};

module.exports = {
  getMutuelles,
  createMutuelle,
  getMutuellesPatient,
  affecterMutuellePatient,
};
