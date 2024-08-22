const traitementModel = require('../models/traitement.model');

const getControllerTraitement = async (req, res, next) => {
  try {

    const data = await traitementModel.getTraitement();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Traitement non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerTraitementOne = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await traitementModel.gettraitementOne(IDBKeyRange);
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'Service non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  


const postControllerTraitement = async (req, res, next) => {

  try {
    const {consultationId, medicament, dose, frequence, duree, instructions} = req.body;

    await rdvModel.createRdv(consultationId, medicament, dose, frequence, duree, instructions);
    res.status(201).json({ message: 'Traitement créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerTraitement,
  getControllerTraitementOne,
  postControllerTraitement
};
