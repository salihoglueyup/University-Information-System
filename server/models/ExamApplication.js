const mongoose = require('mongoose');

// An available special exam students can apply for (global catalog).
const ExamApplicationSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    type: { type: String, default: 'Muafiyet Sınavı' },
    date: { type: String, default: '' },
    deadline: { type: String, default: '' },
    status: { type: String, default: 'Başvuruya Açık' },
    order: { type: Number, default: 0 },
    appliedUserIds: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('ExamApplication', ExamApplicationSchema);
