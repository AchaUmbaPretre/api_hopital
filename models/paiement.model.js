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

/**
 * Création d'un paiement — renvoie insertId (trace croisée avec le
 * reçu imprimé côté caisse RDC). `tauxFcUsd` (audit bidevise) est
 * persisté SEULEMENT si fourni (le contrôleur ne le passe que lorsque
 * la colonne `taux_fc_usd` existe — migration 001_rdc_metier.sql).
 */
const createPaiement = async (id_facture, amount, date_paiement, methode_paiement, transaction_id, tauxFcUsd) => {
  const avecTaux = tauxFcUsd !== undefined && tauxFcUsd !== null;
  const colonnes = ['id_facture', 'amount', 'date_paiement', 'methode_paiement', 'transaction_id'];
  const valeurs = [id_facture, amount, date_paiement, methode_paiement, transaction_id];
  if (avecTaux) {
    colonnes.push('taux_fc_usd');
    valeurs.push(tauxFcUsd);
  }
  const placeholders = colonnes.map(() => '?').join(', ');
  try {
    const result = await queryAsync(
      `INSERT INTO paiements (${colonnes.join(', ')}) VALUES (${placeholders})`,
      valeurs,
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