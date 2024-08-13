const pharmaModel = require('../models/pharma.model');

const getControllerPharma = async (req, res, next) => {
  try {

    const data = await pharmaModel.getDocteur();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerPharma = async (req, res, next) => {
  try {
    const { patientId , 	personnelId, id_typeConsultation, dateConsultation, diagnostic, notes } = req.body;

    await docteurModel.createDocteur(patientId , personnelId, id_typeConsultation, dateConsultation, diagnostic, notes);
    res.status(201).json({ message: 'Docteur créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerDocteur,
  postControllerDocteur
};
