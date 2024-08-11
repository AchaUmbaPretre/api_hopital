const express = require('express');
const router = express.Router();
const patientController = require('./../controllers/patient.controller')

router.get('/', patientController.getControllerPatient);
router.post('/', patientController.postControllerPatient);

module.exports = router;
