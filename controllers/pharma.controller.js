const pharmaModel = require('../models/pharma.model');

const getControllerPharma = async (req, res, next) => {
  try {

    const data = await pharmaModel.getPharma();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const getControllerPharmaOne = async (req, res, next) => {
  const {id} = req.query;
  try {

    const data = await pharmaModel.getPharmaOne(id);

    if (!data) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerPharma = async (req, res, next) => {
  try {
    const { nomMedicament , description, stock } = req.body;

    await pharmaModel.createPharma(nomMedicament , description, stock);
    res.status(201).json({ message: 'Medicament créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerPharma ,
  postControllerPharma
};
