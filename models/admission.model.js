const pool = require('../config/db.config');

const getAdmission = async () => {
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
      const results = await queryAsync('SELECT * FROM admission');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };

  
  const createAdmission = async (patientId, serviceId, dateAdmission, dateSortie, raisonAdmission) => {
  
    const result = await pool.query(
        'INSERT INTO admission (patientId, serviceId, dateAdmission, dateSortie, raisonAdmission) VALUES (?, ?, ?, ?, ?)',
        [patientId, serviceId, dateAdmission, dateSortie, raisonAdmission]
      );
  
    return result;
  };
  
  
  module.exports = {
    getAdmission,
    createAdmission
  };