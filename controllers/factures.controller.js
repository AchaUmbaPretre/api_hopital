const facturesModel = require('../models/factures.model');

const getControllerFactures = async (req, res, next) => {
  try {

    const data = await facturesModel.getFactures();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Service non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerFacturesOne = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await facturesModel.getFacturesOne(id);
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Facture non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  


const postControllerFactures = async (req, res, next) => {

  try {
    const {patient_id, date_emission, date_limite, montant_total, status} = req.body;

    await facturesModel.createFactures(patient_id, date_emission, date_limite, montant_total, status);
    res.status(201).json({ message: 'Facture créée avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
    getControllerFactures,
    getControllerFacturesOne,
    postControllerFactures
};
