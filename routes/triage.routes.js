const express = require('express');
const router = express.Router();
const triageController = require('./../controllers/triage.controller')

// Triage 4 niveaux RDC (+ urgence vitale tracée, arrêté n°1250/2025).
// 501 tant que migrations/001_rdc_metier.sql n'a pas créé la table.
router.get('/', triageController.getControllerTriage);
router.post('/', triageController.postControllerTriage);

module.exports = router;
