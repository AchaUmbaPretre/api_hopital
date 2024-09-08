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

const getControllerFacturesService = async (req, res, next) => {
  const {type} = req.query;
  try {

    const data = await facturesModel.getFactureService(type);

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
      const { patient_id, date_emission, date_limite, montant_total, status, serviceDetails } = req.body;

  
      // Créer la facture et obtenir l'ID de la facture
      const factureId = await facturesModel.createFactures(patient_id, date_emission, date_limite, montant_total, status);
  
      // Insérer les détails de la facture
      await facturesModel.insertFactureDetails(factureId, req.body.service_details);
  
      res.status(201).json({ message: 'Facture créée avec succès' });
    } catch (err) {
      next(err);
    }
  };
  

module.exports = {
    getControllerFactures,
    getControllerFacturesService,
    getControllerFacturesOne,
    postControllerFactures
};
