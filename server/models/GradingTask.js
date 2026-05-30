const mongoose = require('mongoose');

// A pending grading task in an instructor's evaluation queue (keyed by username).
const GradingTaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseName: { type: String, default: '' },
    type: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    pendingCount: { type: Number, default: 0 }
}, { timestamps: true });

GradingTaskSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('GradingTask', GradingTaskSchema);
