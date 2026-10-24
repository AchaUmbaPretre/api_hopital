const express = require('express');
const router = express.Router();
const mutuelleController = require('./../controllers/mutuelle.controller');

// Liste des mutuelles actives (datalist de l'écran Patients).
router.get('/', mutuelleController.getControllerMutuelles);
// Création d'une mutuelle (organisme partenaire) → id_mutuelle.
router.post('/', mutuelleController.postControllerMutuelle);
// Affectations d'un patient ?id_patient= .
router.get('/patient', mutuelleController.getControllerMutuellesPatient);
// Affectation (upsert) d'un patient à une mutuelle.
router.post('/patient', mutuelleController.postControllerAffectation);

module.exports = router;
