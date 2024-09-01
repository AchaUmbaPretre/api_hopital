const ordonnanceModel = require('../models/ordonnance.model');

const getControllerOrdonnance = async (req, res, next) => {
  try {

    const data = await ordonnanceModel.getOrdonnace();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Ordonnance non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerOrdonnaceOne = async (req, res, next) => {
  const {id_ordonnance} = req.query;
  try {

    const data = await ordonnanceModel.getOrdonnaceOne(id_ordonnance);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerOrdonnance = async (req, res, next) => {
  try {
    const { consultationId, medicamentId, quantite, dateOrdre } = req.body;

    await ordonnanceModel.createOrdonnance(consultationId, medicamentId, quantite, dateOrdre);
    res.status(201).json({ message: 'Ordonnance créée avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerOrdonnance,
  getControllerOrdonnaceOne,
  postControllerOrdonnance
};
