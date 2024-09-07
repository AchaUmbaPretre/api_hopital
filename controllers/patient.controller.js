const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const patientModel = require('../models/patient.model');

const getControllerPatientCount = async (req, res, next) => {
  try {

    const data = await patientModel.getPatientCount();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerPatient = async (req, res, next) => {
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

const getControllerTypePatient = async (req, res, next) => {
  try {

    const data = await patientModel.getTypePatient();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerPatientOne = async (req, res) => {
  const {id_patient} = req.query;

  try {

    const data = await patientModel.getControllerPatientOne(id_patient);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerPatient = async (req, res, next) => {

  try {
    const { nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img } = req.body;

    await patientModel.createPatient(nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, telephone, email, societePatient, assurance, profession, typePatient, groupeSanguin, img);
    res.status(201).json({ message: 'Patient créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerPatientCount,
  getControllerPatient,
  getControllerTypePatient,
  postControllerPatient,
  getControllerPatientOne 
};
