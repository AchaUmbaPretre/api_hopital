const consultModel = require('../models/consult.model');

const getControllerConsultCount = async (req, res, next) => {
  try {
    const data = await consultModel.getConsulCount();

    if (!data) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerConsult = async (req, res, next) => {
  try {

    const data = await consultModel.getConsult();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerConsultOne = async (req, res, next) => {
  const {id_consultation} = req.query;
  try {

    const data = await consultModel.getConsultOne(id_consultation);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerConsultType = async (req, res,next) => {
  try {

    const data = await consultModel.getConsultType();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Consultation non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerConsult = async (req, res, next) => {
  try {
    const { patientId , personnelId, id_typeConsultation, dateConsultation, diagnostic, notes } = req.body;

    const resultat = await consultModel.createConsult(patientId , personnelId, id_typeConsultation, dateConsultation, diagnostic, notes);
    // id_consultation renvoyé : le frontend RDC enchaîne immédiatement
    // les lignes d'ordonnance sur la consultation réelle (POST
    // /api/ordonnance attend consultationId), sans réconciliation.
    res.status(201).json({
      message: 'consultation créée avec succès',
      id_consultation: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerConsultCount,
  getControllerConsult,
  getControllerConsultOne,
  postControllerConsult,
  getControllerConsultType
};
