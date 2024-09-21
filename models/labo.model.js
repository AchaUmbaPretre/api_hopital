const pool = require('../config/db.config');

const getLabo = async () => {
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
      const results = await queryAsync(`SELECT * FROM laboratoire`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des consultation :', error);
      throw error; 
    }
  };

const getTypeAnalyse = async () => {
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
      const results = await queryAsync(`SELECT * FROM type_analyse`);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des type analyse :', error);
      throw error; 
    }
  };

  const getLaboOne = async (id) => {
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
      const results = await queryAsync(`SELECT * FROM laboratoire WHERE id_laboratoire = ?`, [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
      throw error; 
    }
  };

  const createLabo = async (id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques) => {
  
    const result = await pool.query(
        'INSERT INTO laboratoire (id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques]
      );
  
    return result;
  };

    
  module.exports = {
    getLabo,
    getLaboOne,
    createLabo,
    getTypeAnalyse
  };