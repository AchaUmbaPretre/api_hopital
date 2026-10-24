const pool = require('../config/db.config');

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

/**
 * File d'attente pharmacie — UNE LIGNE PAR MÉDICAMENT (B3 RDC, phase 5).
 *
 * ⚠️ Correction de la requête héritée : le GROUP BY consultation.id
 * faisait s'effondrer toutes les lignes d'une même ordonnance en UNE
 * ligne (quantités/médicaments arbitraires) — la pharmacie ne voyait
 * qu'un médicament sur N. La requête :
 *   - renvoie chaque ligne d'ordonnance (id_ordonnance) avec l'id du
 *     médicament (medicament_id) et du patient (id_patient) — ids
 *     exploitables directement par le frontend pour la délivrance ;
 *   - garde les colonnes héritées (quantite, dateOrdre,
 *     nomMedicament, prix, id, nomConsultation, nom_patient) pour la
 *     rétrocompatibilité des écrans existants ;
 *   - les plus récentes d'abord, plafonnées à 200 (file du jour).
 */
const getOrdonnace = async () => {
  try {
    const results = await queryAsync(`SELECT ordonnance.id_ordonnance,
                                               ordonnance.quantite,
                                               ordonnance.dateOrdre,
                                               medicament.id AS medicament_id,
                                               medicament.nomMedicament,
                                               medicament.montant AS prix,
                                               consultation.id,
                                               typeconsultation.nomConsultation,
                                               patient.id_patient,
                                               patient.nom_patient,
                                               patient.prenom,
                                               patient.telephone
                                        FROM ordonnance
                                        INNER JOIN consultation ON ordonnance.consultationId = consultation.id
                                        INNER JOIN patient ON consultation.patientId = patient.id_patient
                                        INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
                                        INNER JOIN medicament ON ordonnance.medicamentId = medicament.id
                                        ORDER BY ordonnance.dateOrdre DESC, ordonnance.id_ordonnance DESC
                                        LIMIT 200`);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des ordonnances :', error);
    throw error;
  }
};

const getOrdonnaceOne = async (id) => {
  try {
    const results = await queryAsync(`SELECT ordonnance.quantite,ordonnance.dateOrdre, medicament.nomMedicament, consultation.id, typeconsultation.nomConsultation, patient.nom_patient, patient.prenom, patient.adresse,traitement.dose, traitement.frequence, traitement.duree FROM ordonnance
INNER JOIN consultation ON ordonnance.consultationId = consultation.id
INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
INNER JOIN medicament ON ordonnance.medicamentId = medicament.id
INNER JOIN patient ON consultation.patientId = patient.id_patient
INNER JOIN traitement ON ordonnance.consultationId = traitement.consultationId
WHERE consultation.id = ?
GROUP BY medicament.id`, [id]);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements :', error);
    throw error;
  }
};

/**
 * Création d'une ligne d'ordonnance — renvoie insertId. Le frontend
 * RDC envoie UNE ligne par médicament (une ordonnance complète =
 * plusieurs POST consécutifs sur la même consultationId).
 */
const createOrdonnance = async (consultationId, medicamentId, quantite, dateOrdre) => {
  try {
    const result = await queryAsync(
      'INSERT INTO ordonnance (consultationId, medicamentId, quantite, dateOrdre) VALUES (?, ?, ?, ?)',
      [consultationId, medicamentId, quantite, dateOrdre],
    );
    return result;
  } catch (error) {
    console.error('Erreur lors de la création de l\'ordonnance :', error);
    throw error;
  }
};

module.exports = {
  getOrdonnace,
  getOrdonnaceOne,
  createOrdonnance,
};
