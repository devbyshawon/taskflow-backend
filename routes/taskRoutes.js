const express = require('express');
const { updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;