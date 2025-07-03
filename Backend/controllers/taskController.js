const Task = require('../models/Task');
const ActionLog = require('../models/ActionLog');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ boardId: req.params.boardId }).populate('assignedTo', 'username');
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    await ActionLog.create({ user: req.user.id, action: 'created task', task: task._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await ActionLog.create({ user: req.user.id, action: 'updated task', task: updatedTask._id });
  res.json(updatedTask);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  await ActionLog.create({ user: req.user.id, action: 'deleted task', task: req.params.id });
  res.json({ success: true });
};