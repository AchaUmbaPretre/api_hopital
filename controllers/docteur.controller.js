const docteurModel = require('../models/docteur.model');
const { postControllerPatient } = require('./patient.controller');

const getControllerDocteur = async (req, res, next) => {
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


const postControllerDocteur = async (req, res, next) => {
  try {
    const { username, hashedPassword, email, postnom, prenom, phone_number, role, department_id, img } = req.body;

    await docteurModel.createDocteur(username, hashedPassword, email, postnom, prenom, phone_number, role, department_id, img);
    res.status(201).json({ message: 'Docteur créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerDocteur,
  postControllerDocteur
};
