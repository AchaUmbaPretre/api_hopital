const pool = require('../config/db.config');

const getService = async () => {
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
      const results = await queryAsync('SELECT * FROM service');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des services :', error);
      throw error; 
    }
  };
  
  const createService = async (nomService , description) => {
  
    const result = await pool.query(
        'INSERT INTO service (nomService, description) VALUES (?,?)',
        [nomService, description]
      );
  
    return result;
  };
  
  
  module.exports = {
    getService,
    createService,
  };