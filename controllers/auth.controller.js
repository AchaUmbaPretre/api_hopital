const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth.config');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, email, postnom, prenom, phone_number, role, department_id, img } = req.body;
    const existingUser = await userModel.getUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    await userModel.createUser(username, password, email, postnom, prenom, phone_number, role, department_id, img);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
};
