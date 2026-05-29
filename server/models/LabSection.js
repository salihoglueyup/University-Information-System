const mongoose = require('mongoose');

// A lab section an instructor is responsible for (keyed by username).
const LabSectionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    code: { type: String, default: '' },
    courseName: { type: String, default: '' },
    section: { type: String, default: '' },
    time: { type: String, default: '' },
    room: { type: String, default: '' },
    studentCount: { type: Number, default: 0 },
    nextSession: { type: String, default: '' }
}, { timestamps: true });

LabSectionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('LabSection', LabSectionSchema);
