const express = require('express');
const router = express.Router();
const admissionController = require('./../controllers/admission.controlller')

router.get('/', admissionController.getControllerAdmission);
router.post('/', admissionController.postControllerAdmission);

module.exports = router;
