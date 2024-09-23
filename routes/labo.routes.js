const express = require('express');
const router = express.Router();
const laboController = require('./../controllers/labo.controller')

/* router.get('/count', consultaController.getControllerConsultCount);
 */
router.get('/', laboController.getControllerLabo);
router.get('/one', laboController.getControllerLaboOne);
 router.get('/type_analyse', laboController.getControllerTypeAnalyse);
 router.post('/', laboController.postControllerLabo);

 router.get('/prescription', laboController.getControllerPrescription_laboratoire);
 router.post('/prescription', laboController.postControllerPrescription_laboratoire);

 router.get('/transmission', laboController.getControllerTransmission_resultant);
 router.get('/transmission/one', laboController.getControllerTransmission_resultantOne);
 router.post('/transmission', laboController.postControllerTransmission_resultant);

module.exports = router;