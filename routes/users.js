const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/sign-up', userController.register);

router.post('/sign-in', userController.authenticate);

router.get('/:id', userController.showProfile);

module.exports = router;
