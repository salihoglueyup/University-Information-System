const mongoose = require('mongoose');

// A departmental/administrative task assigned to a user (keyed by username).
const DeptTaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    task: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    deadline: { type: String, default: '' },
    assignedBy: { type: String, default: '' }
}, { timestamps: true });

DeptTaskSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('DeptTask', DeptTaskSchema);
