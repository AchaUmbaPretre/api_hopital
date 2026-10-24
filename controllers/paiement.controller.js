const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const paiementModel = require('../models/paiement.model');
const { paiementTauxDisponible } = require('../utils/rdcColumns');

const getControllerPaiement = async (req, res, next) => {
  try {

    const data = await paiementModel.getPaiement();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Paiement non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerPaiementOne = async (req, res) => {
  const {id_paiement} = req.query;

  try {

    const data = await paiementModel.getPaiementOne(id_paiement);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerPaiement = async (req, res, next) => {

  try {
    const { id_facture, amount, date_paiement, methode_paiement, transaction_id, taux_fc_usd } = req.body;

    // Audit bidevise RDC : le taux FC/USD appliqué au moment de
    // l'encaissement est persisté SEULEMENT si la colonne existe
    // (migration 001_rdc_metier.sql) — sinon ignoré silencieusement.
    const colonneTaux = await paiementTauxDisponible();
    const resultat = await paiementModel.createPaiement(
      id_facture, amount, date_paiement, methode_paiement, transaction_id,
      colonneTaux && taux_fc_usd !== undefined ? taux_fc_usd : undefined,
    );
    res.status(201).json({
      message: 'Paiement créé avec succès',
      id_paiement: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerPaiement,
  postControllerPaiement,
  getControllerPaiementOne 
};
