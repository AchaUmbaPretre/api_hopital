const serviceModel = require('../models/service.model');

const getControllerService = async (req, res, next) => {
  try {

    const data = await serviceModel.getService();

    if (!data) {
      return res.status(401).json({ success: false, message: 'Service non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};


const postControllerService = async (req, res, next) => {

  try {
    const { nomService, description} = req.body;

    await serviceModel.createService(nomService , description);
    res.status(201).json({ message: 'Docteur créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getControllerService,
  postControllerService
};
