const express = require('express');
const router = express.Router();
const docteurController = require('./../controllers/docteur.controller')

router.get('/', docteurController.getControllerDocteur);
router.get('/province', docteurController.getControllerProvince);
router.get('/specialite', docteurController.getControllerSpecialite);
router.get('/departement', docteurController.getControllerDepartement);
router.post('/', docteurController.postControllerDocteur);

module.exports = router;
