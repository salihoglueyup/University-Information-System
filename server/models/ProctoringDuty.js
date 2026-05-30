const mongoose = require('mongoose');

// An exam proctoring duty assigned to a user (keyed by username).
const ProctoringDutySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    examName: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    room: { type: String, default: '' },
    instructor: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    confirmedDate: { type: String, default: '' }
}, { timestamps: true });

ProctoringDutySchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('ProctoringDuty', ProctoringDutySchema);
