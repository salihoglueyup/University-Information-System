const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    id: { type: Number },
    title: { type: String, default: '' },
    completed: { type: Boolean, default: false }
}, { _id: false });

// A supervised student's thesis assistance record (keyed by advisor username).
const ThesisAssistanceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    studentName: { type: String, default: '' },
    projectTitle: { type: String, default: '' },
    advisor: { type: String, default: '' },
    status: { type: String, enum: ['Draft Review', 'Proposal', 'Final'], default: 'Proposal' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tasks: { type: [TaskSchema], default: [] }
}, { timestamps: true });

ThesisAssistanceSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ThesisAssistance', ThesisAssistanceSchema);
