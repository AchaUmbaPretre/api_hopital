const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const patientModel = require('../models/patient.model');

const getControllerDocteur = async (req, res, next) => {
  try {

    const data = await patientModel.getPatient();

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
    const { nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img } = req.body;

    await patientModel.createPatient(nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img);
    res.status(201).json({ message: 'Patient créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerPatient,
  postControllerPatient
};
