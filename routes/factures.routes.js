const express = require('express');
const router = express.Router();
const facturesController = require('./../controllers/factures.controller')

router.get('/', facturesController.getControllerFactures);
router.get('/one', facturesController.getControllerFacturesOne);
router.post('/', facturesController.postControllerFactures);

module.exports = router;
