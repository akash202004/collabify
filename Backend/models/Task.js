const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  boardId: { type: String, required: true },
}, { timestamps: true });

taskSchema.index({ title: 1, boardId: 1 }, { unique: true });

module.exports = mongoose.model('Task', taskSchema);