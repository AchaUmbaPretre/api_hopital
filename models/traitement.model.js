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

const getTraitement = async () => {
  try {
    const results = await queryAsync(`SELECT medicament.nomMedicament, traitement.dose, traitement.frequence, traitement.duree, traitement.instructions, typeconsultation.nomConsultation, patient.nom_patient AS patient FROM traitement
INNER JOIN consultation ON traitement.consultationId = consultation.id
INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
INNER JOIN patient ON consultation.patientId = patient.id_patient
INNER JOIN medicament ON traitement.medicament = medicament.id`);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des traitements :', error);
    throw error;
  }
};


const gettraitementOne = async (id) => {
  try {
    const results = await queryAsync(`SELECT traitement.medicament, traitement.dose, traitement.frequence, traitement.duree, traitement.instructions, typeconsultation.nomConsultation, patient.nom_patient AS patient FROM traitement
INNER JOIN consultation ON traitement.consultationId = consultation.id
INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
INNER JOIN patient ON consultation.patientId = patient.id_patient WHERE traitement.id = ?`, [id]);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des traitements :', error);
    throw error;
  }
};

/**
 * Création d'un traitement (dose / fréquence / durée) — renvoie
 * insertId. Le frontend RDC le branche à chaque ligne d'ordonnance :
 * la requête GET /api/ordonnance/one INNER JOIN traitement — sans
 * ligne de traitement, le détail d'ordonnance renvoie une liste vide.
 */
const createTraitement = async (consultationId, medicament, dose, frequence, duree, instructions) => {
  try {
    const result = await queryAsync(
      'INSERT INTO traitement (consultationId, medicament, dose, frequence, duree, instructions) VALUES (?, ?, ?, ?, ?, ?)',
      [consultationId, medicament, dose, frequence, duree, instructions],
    );
    return result;
  } catch (error) {
    console.error('Erreur lors de la création du traitement :', error);
    throw error;
  }
};

module.exports = {
  getTraitement,
  gettraitementOne,
  createTraitement,
};
