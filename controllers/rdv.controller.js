const rdvModel = require('../models/rdv.model');

const getControllerRdv = async (req, res, next) => {
  try {

    const data = await rdvModel.getRdv();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Service non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerRdvOne = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await rdvModel.getRdvOne(id);
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Service non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

const getControllerRdvDocteurOne = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await rdvModel.getRdvDocteur(id);
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Service non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

const getControllerRdvDocteurOneConfirmation = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await rdvModel.getRdvOneNotification(id);
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Service non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

const postControllerRdv = async (req, res, next) => {

  try {
    const {id_patient, id_docteur, id_receptionniste, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut} = req.body;

    await rdvModel.createRdv(id_patient, id_docteur, id_receptionniste, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut);
    res.status(201).json({ message: 'Rendez vous créé avec succès' });
  } catch (err) {
    next(err);
  }
};

const putControllerRdvConfirmation = async(req, res) => {
  const {id} = req.query;
  console.log(id)
  try {
    
    await rdvModel.putRdvConfirmation(id)
    res.status(201).json({ message: 'Confirmation mise à jour avec succès' });

  } catch (error) {
    
  }
}

module.exports = {
  getControllerRdv,
  getControllerRdvOne,
  postControllerRdv,
  getControllerRdvDocteurOne,
  putControllerRdvConfirmation,
  getControllerRdvDocteurOneConfirmation 
};
