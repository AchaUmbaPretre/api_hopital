const express = require('express');
const router = express.Router();
const rdvController = require('./../controllers/rdv.controller')

router.get('/', rdvController.getControllerRdv);
router.get('/One',rdvController.getControllerRdvOne);
router.get('/docteur_rdv',rdvController.getControllerRdvDocteurOne);
router.get('/docteur_rdv/confirmation',rdvController.getControllerRdvDocteurOneConfirmation);
router.post('/', rdvController.postControllerRdv);
router.put('/rdv_confirmation', rdvController.putControllerRdvConfirmation);


module.exports = router;
