const mongoose = require('mongoose');

// An online (UZEM/Moodle) course the student is enrolled in (keyed by username).
const OnlineCourseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    instructor: { type: String, default: '' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    lastAccess: { type: String, default: '' },
    nextLiveSession: { type: String, default: '' },
    platform: { type: String, default: 'Moodle' }
}, { timestamps: true });

OnlineCourseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('OnlineCourse', OnlineCourseSchema);
