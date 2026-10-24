const pool = require('../config/db.config');

/** Requête en promesse — style callback obligatoire pour lire les
 *  résultats et les insertId du package `mysql`. */
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

const getPaiement = async () => {
  try {
    const results = await queryAsync('SELECT * FROM paiements');
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des factures :', error);
    throw error;
  }
};

const getPaiementOne = async (id) => {
  try {
    const results = await queryAsync('SELECT * FROM paiements WHERE id_paiement  = ?', [id]);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements :', error);
    throw error;
  }
};

/** Création d'un paiement — renvoie insertId (trace croisée avec le
 *  reçu imprimé côté caisse RDC). */
const createPaiement = async (id_facture, amount, date_paiement, methode_paiement, transaction_id) => {
  try {
    const result = await queryAsync(
      'INSERT INTO paiements (id_facture, amount, date_paiement, methode_paiement, transaction_id) VALUES (?, ?, ?, ?, ?)',
      [id_facture, amount, date_paiement, methode_paiement, transaction_id],
    );
    return result;
  } catch (error) {
    console.error('Erreur lors de la création du paiement :', error);
    throw error;
  }
};


module.exports = {
  getPaiement,
  getPaiementOne,
  createPaiement,
};