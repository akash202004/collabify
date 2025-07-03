const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.get('/:boardId', auth, getTasks);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;