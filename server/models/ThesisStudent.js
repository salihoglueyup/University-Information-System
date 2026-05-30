const mongoose = require('mongoose');

// A thesis/project student supervised by an advisor (keyed by advisor username).
const ThesisStudentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, default: '' },
    projectTitle: { type: String, default: '' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: { type: String, default: '' },
    status: { type: String, default: 'Devam Ediyor' }
}, { timestamps: true });

ThesisStudentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ThesisStudent', ThesisStudentSchema);
