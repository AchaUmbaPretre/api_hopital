const pool = require('../config/db.config');

const getTraitement = async () => {
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
      const results = await queryAsync(`SELECT traitement.medicament, traitement.dose, traitement.frequence, traitement.duree, traitement.instructions, typeconsultation.nomConsultation, patient.nom_patient AS patient FROM traitement
INNER JOIN consultation ON traitement.consultationId = consultation.id
INNER JOIN typeconsultation ON consultation.id_typeConsultation = typeconsultation.id_typeConsultation
INNER JOIN patient ON consultation.patientId = patient.id_patient`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des traitements :', error);
      throw error; 
    }
  };


const gettraitementOne = async (id) => {
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
  
  const createTraitement = async (consultationId, medicament, dose, frequence, duree, instructions) => {
  
    const result = await pool.query(
        'INSERT INTO traitement (consultationId, medicament, dose, frequence, duree, instructions) VALUES (?, ?, ?, ?, ?, ?)',
        [consultationId, medicament, dose, frequence, duree, instructions]
      );
  
    return result;
  };
  
  
  module.exports = {
    getTraitement,
    gettraitementOne,
    createTraitement,
  };