const express = require('express');
const router = express.Router();
const rdvController = require('./../controllers/rdv.controller')

router.get('/', rdvController.getControllerRdv);
router.get('/One',rdvController.getControllerRdvOne);
router.post('/', rdvController.postControllerRdv);

module.exports = router;
