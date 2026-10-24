const triageModel = require('../models/triage.model');

/**
 * Triage 4 niveaux RDC — endpooint optionnel : 501 tant que la
 * migration 001_rdc_metier.sql n'a pas créé la table (le frontend
 * offline-first garde sa trace locale entre-temps, zéro perte).
 */

const getControllerTriage = async (req, res, next) => {
  try {
    const data = await triageModel.getTriage();
    res.json(data);
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const postControllerTriage = async (req, res, next) => {
  try {
    const {
      patient_id, niveau, motif, orientation, urgence_vitale,
      autorise_par, motif_autorisation, montant_du_usd, cree_par, date_triage,
    } = req.body;

    // Validation minimale : patient + niveau valide (ENUM côté SQL,
    // mais on refuse tôt avec un message clair pour le badge « echec »).
    const niveaux = ['rouge', 'orange', 'jaune', 'vert'];
    if (!patient_id || !niveaux.includes(niveau)) {
      return res.status(400).json({
        success: false,
        message: 'patient_id et niveau (rouge|orange|jaune|vert) sont requis',
      });
    }
    // Urgence vitale : l'autorité et le motif sont OBLIGATOIRES
    // (arrêté n°1250/2025 — qui a autorisé la prise en charge sans
    // paiement ne peut pas rester anonyme).
    if (urgence_vitale && (!autorise_par || !motif_autorisation)) {
      return res.status(400).json({
        success: false,
        message: "urgence_vitale exige autorise_par et motif_autorisation (arrêté n°1250/2025)",
      });
    }

    const resultat = await triageModel.createTriage({
      patientId: patient_id,
      niveau,
      motif,
      orientation,
      urgenceVitale: Boolean(urgence_vitale),
      autorisePar: autorise_par,
      motifAutorisation: motif_autorisation,
      montantDuUsd: montant_du_usd,
      creePar: cree_par,
      dateTriage: date_triage || new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    res.status(201).json({
      message: 'Triage créé avec succès',
      id_triage: resultat ? resultat.insertId : undefined,
    });
  } catch (err) {
    if (err && err.status === 501) {
      return res.status(501).json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  getControllerTriage,
  postControllerTriage,
};
