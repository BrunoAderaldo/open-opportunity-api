const express = require('express');
const router = express.Router();
const project_controller = require('../controllers/projectController');

/* GET projects listing. */
router.get('/', project_controller.project_list);

/* POST projects. */
router.post('/', project_controller.project_create);

/* GET project detail. */
router.get('/:projectId', project_controller.project_detail);

/* PATCH project update. */
router.patch('/:projectId', project_controller.project_update);

/* DELETE project. */
router.delete('/:projectId', project_controller.project_delete);

module.exports = router;
