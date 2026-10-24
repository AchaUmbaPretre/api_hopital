const express = require('express');
const router = express.Router();
const pharmaController = require('./../controllers/pharma.controller')

router.get('/', pharmaController.getControllerPharma);
router.post('/', pharmaController.postControllerPharma);
// Ajustement ATOMIQUE du stock : { id, quantite } — quantite négative
// - sortie (délivrance), positive = entrée (réappro).
router.post('/stock', pharmaController.postControllerPharmaStock);

module.exports = router;
