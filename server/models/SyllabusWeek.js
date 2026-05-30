const mongoose = require('mongoose');

// A weekly entry in a course syllabus (keyed by catalog course id).
const SyllabusWeekSchema = new mongoose.Schema({
    courseId: { type: String, required: true },
    week: { type: Number, default: 1 },
    topic: { type: String, default: '' },
    resources: { type: String, default: '' }
}, { timestamps: true });

SyllabusWeekSchema.index({ courseId: 1, week: 1 });

module.exports = mongoose.model('SyllabusWeek', SyllabusWeekSchema);
