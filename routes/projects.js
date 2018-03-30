const express = require('express');
const router = express.Router();
const project_controller = require('../controllers/projectController');

/* GET projects listing. */
router.get('/', project_controller.project_list);

router.post('/', project_controller.project_create_post);

module.exports = router;
