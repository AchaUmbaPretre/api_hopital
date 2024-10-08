const express = require('express');
const router = express.Router();
const patientController = require('./../controllers/patient.controller')

router.get('/count', patientController.getControllerPatientCount);
router.get('/', patientController.getControllerPatient);
router.get('/type', patientController.getControllerTypePatient);
router.get('/One', patientController.getControllerPatientOne);
router.post('/', patientController.postControllerPatient);

module.exports = router;
