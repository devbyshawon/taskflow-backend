const express = require('express');
const { createProject, getMyProjects, getProjectById, 
    updateProject, deleteProject, addMember, removeMember } = require('../controllers/projectController');
const { createTask, getMyTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.post('/:id/tasks', protect, createTask);
router.get('/:id/tasks', protect, getMyTask);

module.exports = router;