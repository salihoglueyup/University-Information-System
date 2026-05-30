const mongoose = require('mongoose');

// A question in an instructor's exam question bank (keyed by username).
const QuestionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    text: { type: String, default: '' },
    course: { type: String, default: '' },
    topic: { type: String, default: '' },
    difficulty: { type: String, enum: ['Kolay', 'Orta', 'Zor'], default: 'Orta' },
    type: { type: String, default: 'Klasik' },
    date: { type: String, default: '' }
}, { timestamps: true });

QuestionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Question', QuestionSchema);
