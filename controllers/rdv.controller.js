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
  
      const data = await rdvModel.getRdvOne();
  
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
    const {id_patient, id_utilisateur, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut} = req.body;

    await rdvModel.createRdv(id_patient, id_utilisateur, date_rdv, heure_debut, heure_fin, type_rendezvous, motif_rdv, statut);
    res.status(201).json({ message: 'Rendez vous créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerRdv,
  getControllerRdvOne,
  postControllerRdv
};
