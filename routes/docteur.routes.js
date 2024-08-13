const express = require('express');
const router = express.Router();
const docteurController = require('./../controllers/docteur.controller')

router.get('/', docteurController.getControllerDocteur);
router.post('/', docteurController.postControllerDocteur);

module.exports = router;
