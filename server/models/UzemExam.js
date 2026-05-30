const mongoose = require('mongoose');

// An online (UZEM) exam scheduled for a user (keyed by username).
const UzemExamSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    type: { type: String, default: 'Vize' },
    date: { type: String, default: '' },
    duration: { type: String, default: '' },
    status: { type: String, default: 'Bekliyor' }
}, { timestamps: true });

UzemExamSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('UzemExam', UzemExamSchema);
