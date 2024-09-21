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

module.exports = {
  getControllerLabo,
  getControllerLaboOne,
  postControllerLabo,
  getControllerTypeAnalyse
};
