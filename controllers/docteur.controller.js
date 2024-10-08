const bcrypt = require('bcryptjs');
const docteurModel = require('../models/docteur.model');
const saltRounds = 10; // Le nombre de tours pour le hachage

const getControllerDocteurCount = async (req, res, next) => {
  try {
    const data = await docteurModel.getDocteurCount();

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerDocteurOne = async (req, res, next) => {
  const {id_docteur} = req.query;
  try {
    const data = await docteurModel.getDocteurOne(id_docteur);

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getControllerDocteur = async (req, res, next) => {
  try {
    const data = await docteurModel.getDocteur();

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getControllerProvince = async (req, res, next) => {
  try {
    const data = await docteurModel.getProvince();

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getControllerSpecialite = async (req, res, next) => {
  try {
    const data = await docteurModel.getSpecialite();

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};


const getControllerDepartement = async (req, res, next) => {
  try {
    const data = await docteurModel.getDepartement();

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun departement trouvé' });
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const postControllerDocteur = async (req, res, next) => {

  try {
    const { username, password, email, postnom, prenom, phone_number, role, department_id, specialite, adresse, img } = req.body;

    // Définir le mot de passe par défaut si aucun mot de passe n'est fourni
    const plainPassword = password || '123456';
    const docteurRole = role || 1

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    await docteurModel.createDocteur(username, hashedPassword, email, postnom, prenom, phone_number, docteurRole, department_id, specialite, adresse, img);
    res.status(201).json({ success: true, message: 'Docteur créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerDocteurOne,
getControllerDocteurCount,
  getControllerDocteur,
  getControllerSpecialite,
  postControllerDocteur,
  getControllerDepartement,
  getControllerProvince
};
