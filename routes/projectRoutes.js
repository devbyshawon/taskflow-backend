const express = require('express');
const { createProject, getMyProjects, getProjectById } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);
router.get('/:id', protect, getProjectById);

module.exports = router;