const mongoose = require('mongoose');

// A graduate student's academic progress record (one per user, keyed by username).
const AcademicProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    program: { type: String, default: '' },
    stage: { type: String, default: '' },
    advisor: { type: String, default: '' },
    completedCredits: { type: Number, default: 0 },
    requiredCredits: { type: Number, default: 0 },
    gpa: { type: Number, default: 0 },
    milestones: [{
        name: String,
        date: String,
        status: String,
        description: String,
        grade: String
    }],
    publications: [{
        title: String,
        journal: String,
        date: String,
        status: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('AcademicProgress', AcademicProgressSchema);
