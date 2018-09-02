const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sign-up', authController.register);
router.post('/sign-in', authController.authenticate);

module.exports = router;
