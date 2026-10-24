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

const getPharma = async () => {
  try {
    const results = await queryAsync('SELECT * FROM medicament');
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des medicaments :', error);
    throw error;
  }
};


const getPharmaOne = async (id) => {
  try {
    const results = await queryAsync('SELECT * FROM medicament WHERE id = ?', [id]);
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération du medicament :', error);
    throw error;
  }
};

const createPharma = async (nomMedicament , description, stock) => {
  try {
    const result = await queryAsync(
      'INSERT INTO medicament (nomMedicament , description, stock) VALUES (?, ?, ?)',
      [nomMedicament , description, stock],
    );
    return result;
  } catch (error) {
    console.error('Erreur lors de la création du medicament :', error);
    throw error;
  }
};

/**
 * Ajustement de stock ATOMIQUE (délivrance d'ordonnance, vente
 * directe, réapprovisionnement) :
 *  - `quantite` positive = entrée, négative = sortie ;
 *  - GREATEST(0, …) : le stock ne passe JAMAIS en négatif (un débit
 *    supérieur au stock disponible est plafonné à 0) ;
 *  - `affectedRows` permet au contrôleur de distinguer un médicament
 *    introuvable (0 ligne touchée) d'un ajustement réussi.
 * Le frontend RDC (pharmacie, phase 5) appelle cet endpoint à chaque
 * délivrance — un appel PAR médicament délivré, idempotent par la clé
 * X-Idempotence-Key envoyée par le moteur de synchronisation.
 */
const ajusterStock = async (id, quantite) => {
  const delta = Number(quantite);
  if (!Number.isFinite(delta) || Math.floor(delta) !== delta || delta === 0) {
    const err = new Error('Quantité invalide : entier non nul attendu (positif = entrée, négatif = sortie).');
    err.status = 400;
    throw err;
  }
  try {
    const result = await queryAsync(
      'UPDATE medicament SET stock = GREATEST(0, stock + ?) WHERE id = ?',
      [delta, id],
    );
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'ajustement du stock :', error);
    throw error;
  }
};

module.exports = {
  getPharma,
  getPharmaOne,
  createPharma,
  ajusterStock,
};
