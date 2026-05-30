const mongoose = require('mongoose');

// A scheduled exam session for the proctoring scheduler (global, admin-managed).
const ExamSessionSchema = new mongoose.Schema({
    courseName: { type: String, default: '' },
    courseCode: { type: String, default: '' },
    examType: { type: String, default: 'Vize' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    classrooms: { type: [String], default: [] },
    studentsCount: { type: Number, default: 0 },
    instructor: { type: String, default: '' },
    proctors: { type: [String], default: [] },
    status: { type: String, enum: ['Planlandı', 'Taslak', 'Tamamlandı', 'İptal'], default: 'Taslak' }
}, { timestamps: true });

ExamSessionSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('ExamSession', ExamSessionSchema);
