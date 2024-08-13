const pool = require('../config/db.config');

const getPharma = async () => {
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
      const results = await queryAsync('SELECT * FROM consultation');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };
  
  const createPharma = async (nomMedicament , description, stock) => {
  
    const result = await pool.query(
        'INSERT INTO medicament (nomMedicament , description, stock) VALUES (?, ?, ?)',
        [nomMedicament , description, stock]
      );
  
    return result;
  };
  
  
  module.exports = {
    getPharma,
    createPharma,
  };