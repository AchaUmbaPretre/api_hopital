const express = require('express');
const router = express.Router();
const consultaController = require('./../controllers/consult.controller')

router.get('/count', consultaController.getControllerConsultCount);
router.get('/', consultaController.getControllerConsult);
router.get('/one', consultaController.getControllerConsultOne);
router.get('/consult_type', consultaController.getControllerConsultType);
router.post('/', consultaController.postControllerConsult);

module.exports = router;
