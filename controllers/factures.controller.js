const facturesModel = require('../models/factures.model');
const { colonnesFacturesRdc } = require('../utils/rdcColumns');

const getControllerFactures = async (req, res, next) => {
  try {

    const data = await facturesModel.getFactures();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Service non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerFacturesService = async (req, res, next) => {
  const {type} = req.query;
  try {

    const data = await facturesModel.getFactureService(type);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Service non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerFacturesOne = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await facturesModel.getFacturesOne(id);
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Facture non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  


  const postControllerFactures = async (req, res, next) => {
    try {
      const { patient_id, date_emission, date_limite, montant_total, status, serviceDetails } = req.body;

  
      // Créer la facture et obtenir l'ID de la facture
      const factureId = await facturesModel.createFactures(patient_id, date_emission, date_limite, montant_total, status);
  
      // Insérer les détails de la facture
      await facturesModel.insertFactureDetails(factureId, req.body.service_details);
  
      // id_facture renvoyé : le frontend offline-first RDC peut lier
      // immédiatement les paiements/acomptes à la facture réelle, sans
      // réconciliation par correspondance (patient + montant + date).
      res.status(201).json({ message: 'Facture créée avec succès', id_facture: factureId });

      // Extras RDC (audit arrêté n°1250/2025 + bidevise) : persistés
      // SEULEMENT si la migration 001_rdc_metier.sql a ajouté les
      // colonnes — sinon ignorés silencieusement (comportement hérité
      // intact), les traces restent dans le payload frontend + reçu.
      // Hors du try/catch du POST : un échec d'audit ne doit jamais
      // faire échouer la facture (déjà créée).
      try {
        const colonnes = await colonnesFacturesRdc();
        if (colonnes.length > 0) {
          const champs = [];
          const valeurs = [];
          if (colonnes.includes('mode') && req.body.mode !== undefined) {
            champs.push('mode = ?'); valeurs.push(req.body.mode);
          }
          if (colonnes.includes('motif') && req.body.motif_exoneration !== undefined) {
            champs.push('motif = ?'); valeurs.push(req.body.motif_exoneration);
          }
          if (colonnes.includes('autorise_par') && req.body.autorise_par !== undefined) {
            champs.push('autorise_par = ?'); valeurs.push(req.body.autorise_par);
          }
          if (colonnes.includes('facture_locale') && req.body.facture_locale !== undefined) {
            champs.push('facture_locale = ?'); valeurs.push(req.body.facture_locale);
          }
          if (colonnes.includes('dossier_patient') && req.body.dossier_patient !== undefined) {
            champs.push('dossier_patient = ?'); valeurs.push(req.body.dossier_patient);
          }
          if (champs.length > 0) {
            valeurs.push(factureId);
            await facturesModel.majExtrasRdc(champs, valeurs);
          }
        }
      } catch (errAudit) {
        console.error('[factures] extras RDC non persistés (non bloquant) :', errAudit.message);
      }
    } catch (err) {
      next(err);
    }
  };
  

module.exports = {
    getControllerFactures,
    getControllerFacturesService,
    getControllerFacturesOne,
    postControllerFactures
};
