const pool = require('../config/db.config');

const getOrdonnace = async () => {
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
  
  const createOrdonnance = async (consultationId, medicamentId, quantite, dateOrdre) => {
  
    const result = await pool.query(
        'INSERT INTO ordonnance (consultationId, medicamentId, quantite, dateOrdre) VALUES (?, ?, ?, ?)',
        [consultationId, medicamentId, quantite, dateOrdre]
      );
  
    return result;
  };
  
  
  module.exports = {
    getOrdonnace,
    getOrdonnaceOne,
    createOrdonnance
  };