const userModel = require('../models/user.model');

const getControllerUserAll = async (req, res, next) => {
  try {

    const data = await userModel.getUserAll();

    if (!data) {
      return res.status(401).json({ success: false, message: 'USER non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};
const getControllerUser = async (req, res, next) => {
  try {

    const data = await userModel.getUserByUsername;

    if (!data) {
      return res.status(401).json({ success: false, message: 'USER non trouvé' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getControllerUserOne = async (req, res, next) => {
    const {id} = req.query;
    try {
  
      const data = await userModel.getUserByUsernameOne();
  
      if (!data) {
        return res.status(401).json({ success: false, message: 'User non trouvé' });
      }
  
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
  

module.exports = {
  getControllerUser,
  getControllerUserOne,
  getControllerUserAll
};
