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
      const results = await queryAsync('SELECT * FROM ordonnance');
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
      const results = await queryAsync('SELECT * FROM ordonnance WHERE id  = ?', [id]);
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