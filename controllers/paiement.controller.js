const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const paiementModel = require('../models/paiement.model');

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
    const { id_facture, amount, date_paiement, methode_paiement, transaction_id} = req.body;

    await paiementModel.createPaiement(id_facture, amount, date_paiement, methode_paiement, transaction_id);
    res.status(201).json({ message: 'Paiement créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerPaiement,
  postControllerPaiement,
  getControllerPaiementOne 
};
