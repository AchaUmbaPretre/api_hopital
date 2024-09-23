const laboModel = require('../models/labo.model');

const getControllerLabo = async (req, res, next) => {
  try {

    const data = await laboModel.getLabo();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Labo non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerTypeAnalyse = async (req, res, next) => {
    try {
  
      const data = await laboModel.getTypeAnalyse()
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Labo non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

const getControllerLaboOne = async (req, res, next) => {
  const {id_labo} = req.query;
  try {

    const data = await laboModel.getLaboOne(id_labo);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerLabo = async (req, res, next) => {
  try {
    const { id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques } = req.body;

    await laboModel.createLabo(id_consultation, id_patient, id_type_analyse, date_demande, date_analyse, resultats, status, remarques);
    res.status(201).json({ message: 'Laboratoire créée avec succès' });
  } catch (err) {
    next(err);
  }
};

const getControllerPrescription_laboratoire = async (req, res, next) => {
  try {

    const data = await laboModel.getPrescription_laboratoire();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Labo non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const postControllerPrescription_laboratoire = async (req, res, next) => {
  try {
    const { id_consultation, id_type_analyse, date_prescription, status } = req.body;

    await laboModel.createPrescriptionLabo(id_consultation, id_type_analyse, date_prescription, status);
    res.status(201).json({ message: 'Prescription Laboratoire créée avec succès' });
  } catch (err) {
    next(err);
  }
};


//Transmission resultant
const getControllerTransmission_resultant = async (req, res, next) => {
  try {

    const data = await laboModel.getTransmission_resultat();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Labo non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerTransmission_resultantOne = async (req, res, next) => {
  try {

    const data = await laboModel.getTransmission_resultatOne()

    if (!data) {
      return res.status(401).json({ success: false, message: 'Labo non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const postControllerTransmission_resultant = async (req, res, next) => {
  try {
    const { id_laboratoire, id_docteur, date_transmission, remarques } = req.body;

    await laboModel.createTransmission_resultat(id_laboratoire, id_docteur, date_transmission, remarques);
    res.status(201).json({ message: 'Prescription Laboratoire créée avec succès' });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getControllerLabo,
  getControllerLaboOne,
  postControllerLabo,
  getControllerTypeAnalyse,
  getControllerPrescription_laboratoire,
  getControllerTransmission_resultant,
  getControllerTransmission_resultantOne,
  postControllerPrescription_laboratoire,
  postControllerTransmission_resultant
};
