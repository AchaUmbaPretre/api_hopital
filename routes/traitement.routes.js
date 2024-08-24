const express = require('express');
const router = express.Router();
const traitementController = require('./../controllers/traitement.controller')

router.get('/', traitementController.getControllerTraitement);
router.get('/one',traitementController.getControllerTraitementOne);
router.post('/', traitementController.postControllerTraitement);

module.exports = router;
