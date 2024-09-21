const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth.config');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.getUserByUsername(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const { id, username, role } = user;

    res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id,
        username,
        role,
        token
      }
    });
  } catch (err) {
    // Pass error to error handling middleware
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

const logout = async(req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'None',
    secure: true,
  });

  res.status(200).json({ message: 'Utilisateur déconnecté avec succès' });
}

module.exports = {
  login,
  register,
  logout
};
