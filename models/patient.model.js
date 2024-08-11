const pool = require('../config/db.config');

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
      const results = await queryAsync('SELECT * FROM patient');
      return results[0]; 
    } catch (error) {
      console.error('Erreur lors de la récupération des patients :', error);
      throw error; 
    }
  };
  
  const createPatient = async (nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img) => {
  
    const result = await pool.query(
      'INSERT INTO users (nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img]
    );
  
    return result;
  };
  
  
  module.exports = {
    getPatient,
    createPatient,
  };