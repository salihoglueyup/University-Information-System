const mongoose = require('mongoose');

// A card on the thesis-tracking kanban board (keyed by advisor username).
const ThesisTaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, default: '' },
    student: { type: String, default: '' },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    date: { type: String, default: '' },
    column: { type: String, enum: ['todo', 'in_progress', 'completed'], default: 'todo' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

ThesisTaskSchema.index({ userId: 1, column: 1, order: 1 });

module.exports = mongoose.model('ThesisTask', ThesisTaskSchema);
