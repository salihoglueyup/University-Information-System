const mongoose = require('mongoose');

// An e-exam appointment for a user (keyed by username).
const ElectronicExamSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    course: { type: String, default: '' },
    date: { type: String, default: '' },
    center: { type: String, default: '' },
    status: { type: String, default: 'Randevu Bekliyor' }
}, { timestamps: true });

ElectronicExamSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ElectronicExam', ElectronicExamSchema);
