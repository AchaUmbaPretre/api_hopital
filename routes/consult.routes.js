const express = require('express');
const router = express.Router();
const consultaController = require('./../controllers/consult.controller')

router.get('/', consultaController.getControllerConsult);
router.get('/consult_type', consultaController.getControllerConsultType);
router.post('/', consultaController.postControllerConsult);

module.exports = router;
