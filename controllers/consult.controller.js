const docteurModel = require('../models/docteur.model');
const { getControllerDocteur, postControllerDocteur } = require('./docteur.controller');

const getControllerConsult = async (req, res, next) => {
  try {

    const data = await docteurModel.getDocteur();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerConsult = async (req, res, next) => {
  try {
    const { patientId , personnelId, id_typeConsultation, dateConsultation, diagnostic, notes } = req.body;

    await docteurModel.createDocteur(patientId , personnelId, id_typeConsultation, dateConsultation, diagnostic, notes);
    res.status(201).json({ message: 'consultation créée avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerConsult,
  postControllerDocteur
};
