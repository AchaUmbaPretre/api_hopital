const pool = require('../config/db.config');

const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

/**
 * TRIAGE 4 NIVEAUX RDC (rouge immédiat / orange ≤ 30 min / jaune ≤ 2 h /
 * vert différable) + urgence vitale tracée (prise en charge SANS
 * paiement préalable, arrêté n°1250/2025 : qui a autorisé, motif,
 * montant dû à régulariser).
 *
 * L'existence de la table dépend de la migration 001_rdc_metier.sql —
 * les contrôleurs interrogent tableTriageDisponible() et répondent 501
 * (non implémenté sur cette base) tant que la migration n'est pas
 * passée : le frontend offline-first conserve sa trace locale entre-
 * temps (zéro perte).
 */
const TABLE_EXISTE = async () => {
  try {
    const lignes = await queryAsync(
      `SELECT COUNT(*) AS n FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'triage'`,
    );
    return Array.isArray(lignes) && lignes[0] ? Number(lignes[0].n) > 0 : false;
  } catch {
    return false;
  }
};

const getTriage = async () => {
  if (!(await TABLE_EXISTE())) {
    const err = new Error('Table triage absente — appliquer migrations/001_rdc_metier.sql');
    err.status = 501;
    throw err;
  }
  try {
    const results = await queryAsync(
      `SELECT t.*, p.nom_patient, p.prenom FROM triage t
       INNER JOIN patient p ON t.patient_id = p.id_patient
       ORDER BY t.date_triage DESC LIMIT 500`,
    );
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des triages :', error);
    throw error;
  }
};

const createTriage = async (entree) => {
  if (!(await TABLE_EXISTE())) {
    const err = new Error('Table triage absente — appliquer migrations/001_rdc_metier.sql');
    err.status = 501;
    throw err;
  }
  try {
    const result = await queryAsync(
      `INSERT INTO triage
         (patient_id, niveau, motif, orientation, urgence_vitale,
          autorise_par, motif_autorisation, montant_du_usd, cree_par, date_triage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entree.patientId,
        entree.niveau,
        entree.motif ?? null,
        entree.orientation ?? null,
        entree.urgenceVitale ? 1 : 0,
        entree.autorisePar ?? null,
        entree.motifAutorisation ?? null,
        entree.montantDuUsd ?? 0,
        entree.creePar ?? null,
        entree.dateTriage,
      ],
    );
    return result;
  } catch (error) {
    console.error('Erreur lors de la création du triage :', error);
    throw error;
  }
};

module.exports = {
  getTriage,
  createTriage,
};
