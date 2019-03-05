const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.get('/', userController.index);
router.get('/:id', userController.show);
router.patch('/:id', authMiddleware, userController.update);

module.exports = router;
