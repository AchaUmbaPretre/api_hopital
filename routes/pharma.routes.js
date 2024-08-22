const express = require('express');
const router = express.Router();
const pharmaController = require('./../controllers/pharma.controller')

router.get('/', pharmaController.getControllerPharma);
router.post('/', pharmaController.postControllerPharma);

module.exports = router;
