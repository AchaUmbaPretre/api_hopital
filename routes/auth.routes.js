const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
const { registerValidation, validate } = require('../utils/validator')
router.post('/login', authController.login);
router.post('/register', registerValidation, validate, authController.register);
router.post('/logout', registerValidation,authController.logout);


module.exports = router;
