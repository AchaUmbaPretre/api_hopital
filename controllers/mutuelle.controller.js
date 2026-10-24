const mutuelleModel = require('../models/mutuelle.model');

/**
 * CRUD MUTUELLES RDC (B3, phase 5) — endpoints optionnels : 501 tant
 * que la migration 001_rdc_metier.sql n'a pas créé les tables. Le
 * frontend offline-first garde ses traces d'affectation locales
 * (outbox) entre-temps — zéro perte, rejeu automatique ensuite.
 */

const getControllerMutuelles = async (req, res, next) => {
  try {
    const data = await mutuelleModel.getMutuelles();
    res.json(data);
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const postControllerMutuelle = async (req, res, next) => {
  try {
    const { nom_organisme, taux_couverture, ticket_moderateur_pct } = req.body;
    if (!nom_organisme || String(nom_organisme).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'nom_organisme est requis' });
    }
    const resultat = await mutuelleModel.createMutuelle(
      String(nom_organisme).trim(),
      taux_couverture,
      ticket_moderateur_pct,
    );
    res.status(201).json({
      message: 'Mutuelle créée avec succès',
      id_mutuelle: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    if (err && err.status === 400) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getControllerMutuellesPatient = async (req, res, next) => {
  try {
    const { id_patient } = req.query;
    if (!id_patient) {
      return res.status(400).json({ success: false, message: 'id_patient est requis' });
    }
    const data = await mutuelleModel.getMutuellesPatient(id_patient);
    res.json(data);
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const postControllerAffectation = async (req, res, next) => {
  try {
    const { patient_id, mutuelle_id, numero_adherent, date_affiliation } = req.body;
    const resultat = await mutuelleModel.affecterMutuellePatient(
      patient_id,
      mutuelle_id,
      numero_adherent,
      date_affiliation,
    );
    res.status(201).json({
      message: 'Affectation mutuelle enregistrée',
      id_patient_mutuelle: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    if (err && err.status === 400) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  getControllerMutuelles,
  postControllerMutuelle,
  getControllerMutuellesPatient,
  postControllerAffectation,
};
