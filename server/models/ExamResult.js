const mongoose = require('mongoose');

// A user's exam results for one course (embedded exams), keyed by username.
const ExamResultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    average: { type: Number, default: 0 },
    letter: { type: String, default: '' },
    exams: [{
        type: { type: String, default: '' },
        date: { type: String, default: '' },
        weight: { type: Number, default: 0 },
        score: { type: Number, default: 0 }
    }]
}, { timestamps: true });

ExamResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ExamResult', ExamResultSchema);
