const pool = require('../config/db.config');

/**
 * Exécute une requête en promesse (style callback — le package `mysql`
 * ne renvoie PAS de résultat exploitable via `await pool.query()` sans
 * callback : les insertId seraient perdus).
 */
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

const getPatientCount = async () => {
  try {
    const results = await queryAsync('SELECT COUNT(id_patient) AS nbre_patient FROM patient');
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des patients :', error);
    throw error;
  }
};

/**
 * Liste des patients.
 * @param {string|null} q — recherche optionnelle (param `?q=`) : filtre
 *   serveur sur nom, prénom et téléphone (LIKE). La collation
 *   utf8mb4_general_ci rend le LIKE insensible à la casse ET aux
 *   accents — cohérent avec la recherche hors ligne du frontend RDC.
 *   Nécessaire au-delà de quelques milliers de fiches (réalité HGR).
 */
const getPatient = async (q = null) => {
  try {
    const base = `SELECT id_patient, patient.nom_patient, patient.prenom, patient.dateNaissance, patient.lieuNaissance, patient.sexe, patient.province, patient.adresse, patient.tel, patient.email, typepatient.nom_typePatient FROM patient
                  LEFT JOIN typePatient ON patient.typePatient = typepatient.id_typePatient
                  GROUP BY patient.id_patient`;
    if (q === null || String(q).trim() === '') {
      return await queryAsync(base);
    }
    const motif = `%${String(q).trim()}%`;
    const chiffres = String(q).replace(/[^0-9]/g, '');
    // Téléphone : si la recherche ne contient que des chiffres, on
    // tolère une correspondance sur une portion du numéro (9 derniers
    // chiffres usuels en RDC après l'indicatif 243).
    const conditionChiffres = chiffres.length >= 4
      ? ` OR REPLACE(REPLACE(patient.tel, ' ', ''), '-', '') LIKE ?`
      : '';
    const params = chiffres.length >= 4 ? [motif, motif, motif, `%${chiffres}%`] : [motif, motif, motif];
    return await queryAsync(
      `${base} HAVING (nom_patient LIKE ? OR prenom LIKE ? OR tel LIKE ?${conditionChiffres})`,
      params,
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des patients :', error);
    throw error;
  }
};

const getTypePatient = async () => {
  try {
    const results = await queryAsync('SELECT * FROM typepatient');
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des type patients :', error);
    throw error;
  }
};

const getPatientOne = async (id_patient) => {
  try {
    const results = await queryAsync(`SELECT patient.*, typepatient.nom_typePatient FROM patient
   INNER JOIN typePatient ON patient.typePatient
    WHERE patient.id_patient = ?
    GROUP BY patient.id_patient `, [id_patient]);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des patients :', error);
    throw error;
  }
};

/**
 * Création d'un patient — renvoie l'id MySQL créé (insertId) pour que
 * le frontend puisse lier immédiatement ses écritures locales (caisse,
 * ordonnance) au patient réel, sans réconciliation par identité.
 */
const createPatient = async (nom_patient, prenom, dateNaissance, lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img) => {
  try {
    const results = await queryAsync(
      'INSERT INTO patient (nom_patient, prenom, dateNaissance, lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom_patient, prenom, dateNaissance, lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img],
    );
    return results;
  } catch (error) {
    console.error('Erreur lors de la création du patient :', error);
    throw error;
  }
};

/**
 * Référence carnet RDC (« INIT-ANNÉE-N° ») — UPDATE non bloquant
 * appelé UNIQUEMENT quand la colonne `dossier` existe (migration 001).
 */
const majDossier = async (idPatient, dossier) => {
  try {
    const results = await queryAsync('UPDATE patient SET dossier = ? WHERE id_patient = ?', [dossier, idPatient]);
    return results;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du dossier :', error);
    throw error;
  }
};

module.exports = {
  getPatientCount,
  getPatient,
  getTypePatient,
  createPatient,
  getPatientOne,
  majDossier,
};
