const pool = require('../config/db.config');
const { tableVenteDisponible } = require('../utils/rdcColumns');

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

/**
 * CARNET DE VENTES DIRECTES (B3 RDC, phase 5) — la table `vente_pharma`
 * (migration 001) enregistre chaque vente au comptoir SANS facture
 * patient : client anonyme ou nommé, lignes vendues, montant total USD
 * et taux FC/USD au moment de la vente (audit bidevise). C'est la
 * pratique réelle des pharmacies d'HGR : le carnet de ventes remplace
 * la facture — la caisse centrale n'intervient que pour les ventes
 * liées à un dossier patient (ordonnance → facture).
 */
async function exigerTableVente() {
  const dispo = await tableVenteDisponible();
  if (!dispo) {
    const err = new Error(
      'Table vente_pharma absente — appliquer migrations/001_rdc_metier.sql (les ventes restent tracées côté frontend)',
    );
    err.status = 501;
    throw err;
  }
}

const createVente = async (vente) => {
  await exigerTableVente();
  return queryAsync(
    `INSERT INTO vente_pharma
       (reference_locale, client_nom, lignes_json, montant_total_usd, taux_fc_usd, date_vente)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      vente.referenceLocale,
      vente.clientNom,
      vente.lignesJson,
      vente.montantTotalUsd,
      vente.tauxFcUsd,
      vente.dateVente,
    ],
  );
};

const getVentes = async () => {
  await exigerTableVente();
  return queryAsync(
    `SELECT id_vente, reference_locale, client_nom, lignes_json,
            montant_total_usd, taux_fc_usd, date_vente
     FROM vente_pharma ORDER BY date_vente DESC, id_vente DESC LIMIT 100`,
  );
};

module.exports = {
  getPharma,
  getPharmaOne,
  createPharma,
  ajusterStock,
  createVente,
  getVentes,
};
