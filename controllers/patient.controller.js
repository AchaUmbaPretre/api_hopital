const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const patientModel = require('../models/patient.model');
const { dossierPatientDisponible } = require('../utils/rdcColumns');

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
    // Recherche serveur optionnelle (gap « param q » — frontend RDC) :
    // GET /api/patient?q=kabila  OU  ?q=+243991234567
    const data = await patientModel.getPatient(req.query.q ?? null);

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

const getControllerPatientOne = async (req, res, next) => {
  const {id_patient} = req.query;

  try {

    const data = await patientModel.getPatientOne(id_patient);

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
    const { nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient,   groupeSanguin, img } = req.body;

    const resultat = await patientModel.createPatient(nom_patient, prenom,dateNaissance,lieuNaissance, sexe, province, adresse, tel, email, societePatient, assurance, profession, typePatient, groupeSanguin, img);
    // id_patient renvoyé au frontend (offline-first) : il lie
    // immédiatement caisse / ordonnances au patient réel créé.
    res.status(201).json({
      message: 'Patient créé avec succès',
      id_patient: resultat ? resultat.insertId : undefined,
    });

    // Référence carnet RDC (« INIT-ANNÉE-N° », générée par le
    // frontend) : persistée SEULEMENT si la colonne `dossier` existe
    // (migration 001_rdc_metier.sql) — jamais bloquante.
    try {
      if (req.body.dossier !== undefined && (await dossierPatientDisponible()) && resultat && resultat.insertId) {
        await patientModel.majDossier(resultat.insertId, req.body.dossier);
      }
    } catch (errDossier) {
      console.error('[patient] dossier RDC non persisté (non bloquant) :', errDossier.message);
    }
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
