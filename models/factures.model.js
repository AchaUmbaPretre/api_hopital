const pool = require('../config/db.config');

const getFactures = async () => {
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
      const results = await queryAsync('SELECT * FROM factures');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
      throw error; 
    }
  };

  const getFacturesOne = async (id) => {
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
      const results = await queryAsync('SELECT * FROM factures WHERE id_facture = ?', [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
      throw error; 
    }
  };

  const createFactures = async (patient_id, date_emission, date_limite, montant_total, status) => {
  
    const result = await pool.query(
        'INSERT INTO factures (patient_id, date_emission, date_limite, montant_total, status) VALUES (?, ?, ?, ?, ?)',
        [patient_id, date_emission, date_limite, montant_total, status]
      );
  
    return result;
  };
  
  
  module.exports = {
    getFactures,
    getFacturesOne,
    createFactures
  };