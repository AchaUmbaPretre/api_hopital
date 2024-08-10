const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('username').isString().withMessage('Username doit être une chaîne de caractères'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  validate,
};
