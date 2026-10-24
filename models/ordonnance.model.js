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

const getOrdonnace = async () => {
  try {
    const results = await queryAsync(`SELECT ordonnance.quantite,ordonnance.dateOrdre, medicament.nomMedicament, medicament.montant AS prix, consultation.id, typeconsultation.nomConsultation, patient.nom_patient FROM ordonnance
                                        INNER JOIN consultation ON ordonnance.consultationId = consultation.id
                                        INNER JOIN patient ON consultation.patientId = patient.id_patient
                                        INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
                                        INNER JOIN medicament ON ordonnance.medicamentId = medicament.id
                                        GROUP BY consultation.id`);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des consultation :', error);
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
