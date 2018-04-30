const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.list);

router.post('/', projectController.create);

router.get('/:projectId', projectController.detail);

router.patch('/:projectId', projectController.update);

router.delete('/:projectId', projectController.delete);

module.exports = router;
