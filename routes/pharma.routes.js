const express = require('express');
const router = express.Router();
const pharmaController = require('./../controllers/pharma.controller')

router.get('/', pharmaController.getControllerPharma);
router.post('/', pharmaController.postControllerPharma);
// Ajustement ATOMIQUE du stock : { id, quantite } — quantite négative
// - sortie (délivrance), positive = entrée (réappro).
router.post('/stock', pharmaController.postControllerPharmaStock);
// Carnet de ventes directes (B3 RDC) : POST = enregistrement d'une
// vente au comptoir (référence VTE-…), GET = 100 dernières (contrôle
// journalier / réconciliation outbox).
router.post('/vente', pharmaController.postControllerPharmaVente);
router.get('/vente', pharmaController.getControllerPharmaVentes);

module.exports = router;
