const Task = require('../models/Task');
const ActionLog = require('../models/ActionLog');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('joinBoard', (boardId) => {
      socket.join(boardId);
    });

    socket.on('updateTask', async ({ taskId, data, userId }) => {
      const updated = await Task.findByIdAndUpdate(taskId, data, { new: true });
      await ActionLog.create({ user: userId, action: 'edited task', task: taskId });
      io.to(updated.boardId).emit('taskUpdated', updated);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
