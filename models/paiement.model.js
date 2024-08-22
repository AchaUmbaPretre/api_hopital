const pool = require('../config/db.config');

const getPaiement = async () => {
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
      const results = await queryAsync('SELECT * FROM paiements');
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des factures :', error);
      throw error; 
    }
  };

  const getPaiementOne = async (id) => {
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
      const results = await queryAsync('SELECT * FROM paiements WHERE id_paiement  = ?', [id]);
      return results; 
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
      throw error; 
    }
  };

  const createPaiement = async (id_facture, amount, date_paiement, methode_paiement, transaction_id) => {
  
    const result = await pool.query(
        'INSERT INTO paiements (id_facture, amount, date_paiement, methode_paiement, transaction_id) VALUES (?, ?, ?, ?, ?)',
        [id_facture, amount, date_paiement, methode_paiement, transaction_id]
      );
  
    return result;
  };
  
  
  module.exports = {
    getPaiement,
    getPaiementOne,
    createPaiement
  };