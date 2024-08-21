const consultModel = require('../models/consult.model');

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


const getControllerConsultType = async (req, res) => {
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

    await consultModel.createConsult(patientId , personnelId, id_typeConsultation, dateConsultation, diagnostic, notes);
    res.status(201).json({ message: 'consultation créée avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerConsult,
  postControllerConsult,
  getControllerConsultType
};
