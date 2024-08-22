const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user.controller')

router.get('/', userController.getControllerUser);
router.get('/one',userController.getControllerUserOne);

module.exports = router;
