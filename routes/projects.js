const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const projectController = require('../controllers/projectController');

router.get('/', projectController.list);
router.post('/', authMiddleware, projectController.create);
router.get('/:id', projectController.detail);
router.patch('/:id', authMiddleware, projectController.update);

router.delete('/:id', authMiddleware, projectController.delete);

module.exports = router;
