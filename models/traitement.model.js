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
      const results = await queryAsync('SELECT * FROM traitement');
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
      const results = await queryAsync('SELECT * FROM traitement WHERE id = ?', [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des traitements :', error);
      throw error; 
    }
  };
  
  const createTraitement = async (consultationId, medicament, dose, frequence, duree, instructions) => {
  
    const result = await pool.query(
        'INSERT INTO rdv (consultationId, medicament, dose, frequence, duree, instructions) VALUES (?, ?, ?, ?, ?, ?)',
        [consultationId, medicament, dose, frequence, duree, instructions]
      );
  
    return result;
  };
  
  
  module.exports = {
    getTraitement,
    gettraitementOne,
    createTraitement,
  };