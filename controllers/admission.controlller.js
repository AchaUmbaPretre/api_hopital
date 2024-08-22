const admissionModel = require('../models/admission.model');

const getControllerAdmission = async (req, res, next) => {
  try {

    const data = await admissionModel.getAdmission();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Admission non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerAdmission = async (req, res, next) => {
  try {
    const { patientId, serviceId, dateAdmission, dateSortie, raisonAdmission } = req.body;

    await admissionModel.createAdmission(patientId, serviceId, dateAdmission, dateSortie, raisonAdmission);
    res.status(201).json({ message: 'Admission créée avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerAdmission,
  postControllerAdmission
};
