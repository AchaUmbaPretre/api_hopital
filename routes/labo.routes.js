const express = require('express');
const router = express.Router();
const laboController = require('./../controllers/labo.controller')

/* router.get('/count', consultaController.getControllerConsultCount);
 */
router.get('/', laboController.getControllerLabo);
router.get('/one', laboController.getControllerLaboOne);
 router.get('/', laboController.getControllerTypeAnalyse);
 router.post('/', laboController.postControllerLabo);

module.exports = router;