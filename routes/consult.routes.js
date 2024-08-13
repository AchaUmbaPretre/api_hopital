const express = require('express');
const router = express.Router();
const consultaController = require('./../controllers/consult.controller')

router.get('/', consultaController.getControllerConsult);
router.post('/', docteurController.postControllerConsultation);

module.exports = router;
