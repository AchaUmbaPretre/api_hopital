const express = require('express');
const router = express.Router();
const ordonnanceController = require('./../controllers/ordonnance.controller')

router.get('/', ordonnanceController.getControllerOrdonnance);
router.get('/one', ordonnanceController.getControllerOrdonnaceOne);
router.post('/', ordonnanceController.postControllerOrdonnance);

module.exports = router;
