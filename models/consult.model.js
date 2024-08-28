const pool = require('../config/db.config');

const getConsult = async () => {
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
      const results = await queryAsync(
        `SELECT consultation.*, patient.nom_patient, docteur.prenom AS docteur, tc.nomConsultation, tc.prixConsultation  FROM consultation
          INNER JOIN patient ON consultation.patientId = patient.id_patient
          INNER JOIN users AS docteur ON consultation.personnelId = docteur.id
          INNER JOIN typeconsultation AS tc ON consultation.id_typeConsultation = tc.id_typeConsultation`
);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };

  const getConsultOne = async (id_consultation) => {
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
      const results = await queryAsync(
        `SELECT consultation.*, patient.nom_patient, docteur.prenom AS docteur, tc.nomConsultation, tc.prixConsultation  FROM consultation
          INNER JOIN patient ON consultation.patientId = patient.id_patient
          INNER JOIN users AS docteur ON consultation.personnelId = docteur.id
          INNER JOIN typeconsultation AS tc ON consultation.id_typeConsultation = tc.id_typeConsultation
          WHERE consultation.id = ${id_consultation}`
);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };

const getConsultType = async () => {
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
      const results = await queryAsync('SELECT * FROM typeconsultation');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };
  
  const createConsult = async (patientId , 	personnelId, id_typeConsultation, dateConsultation, diagnostic, notes) => {
  
    const result = await pool.query(
        'INSERT INTO consultation (patientId , 	personnelId, id_typeConsultation, dateConsultation, diagnostic, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [patientId , 	personnelId, id_typeConsultation, dateConsultation, diagnostic, notes]
      );
  
    return result;
  };
  
  
  module.exports = {
    getConsult,
    getConsultOne,
    createConsult,
    getConsultType
  };