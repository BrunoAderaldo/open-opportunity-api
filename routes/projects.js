const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const projectController = require('../controllers/projectController');

router.get('/', projectController.index);
router.post('/', authMiddleware, projectController.store);
router.get('/:id', projectController.show);
router.patch('/:id', authMiddleware, projectController.update);
router.delete('/:id', authMiddleware, projectController.destroy);

module.exports = router;
