const mongoose = require('mongoose');

// A course taught by an instructor this term (keyed by username).
const InstructorCourseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    schedule: { type: String, default: '' },
    room: { type: String, default: '' },
    studentsEnrolled: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0 },
    syllabusStatus: { type: String, default: 'Bekliyor' },
    pendingGrading: { type: Number, default: 0 }
}, { timestamps: true });

InstructorCourseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InstructorCourse', InstructorCourseSchema);
