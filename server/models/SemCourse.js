const mongoose = require('mongoose');

// A continuing-education (SEM) certificate program (global catalog).
const SemCourseSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    price: { type: String, default: '' },
    duration: { type: String, default: '' },
    instructor: { type: String, default: '' },
    order: { type: Number, default: 0 },
    enrolledUserIds: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('SemCourse', SemCourseSchema);
