const pool = require('../config/db.config');

const getPatientCount = async () => {
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
    const results = await queryAsync('SELECT COUNT(id_patient) AS nbre_patient FROM patient');
    return results; 
  } catch (error) {
    console.error('Erreur lors de la récupération des patients :', error);
    throw error; 
  }
};

const getPatient = async () => {
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
      const results = await queryAsync(`SELECT id_patient, patient.nom_patient, patient.prenom, patient.dateNaissance, patient.lieuNaissance, patient.sexe, patient.province, patient.adresse, patient.tel, patient.email, typepatient.nom_typePatient FROM patient
                                          LEFT JOIN typePatient ON patient.typePatient = typepatient.id_typePatient
                                          GROUP BY patient.id_patient`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des patients :', error);
      throw error; 
    }
  };

const getTypePatient = async () => {
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
      const results = await queryAsync('SELECT * FROM typepatient');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des type patients :', error);
      throw error; 
    }
  };
  
const getPatientOne = async (id_patient) => {
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

  const createPatient = async (nom_patient, prenom, dateNaissance, lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img) => {
    const result = await pool.query(
      'INSERT INTO patient (nom_patient, prenom, dateNaissance, lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom_patient, prenom, dateNaissance, lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img]
    );
    
    return result;
  };
  
  
  module.exports = {
    getPatientCount,
    getPatient,
    getTypePatient,
    createPatient,
    getPatientOne
  };