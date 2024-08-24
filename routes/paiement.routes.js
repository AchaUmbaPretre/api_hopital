const express = require('express');
const router = express.Router();
const paiementController = require('./../controllers/paiement.controller')

router.get('/', paiementController.getControllerPaiement);
router.get('/one', paiementController.getControllerPaiementOne);
router.post('/', paiementController.postControllerPaiement);

module.exports = router;
