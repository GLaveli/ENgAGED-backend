const mongoose = require('../../database');
const paginate = require('mongoose-paginate-v2');
const TaskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  complete: {
    type: Boolean,
    required: true,
    default: false
  },
  isPrivate: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

TaskSchema.plugin(paginate);
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;