const mongoose = require('mongoose');

// Medical report submitted by a user for excuse exams / absence (keyed by username).
const HealthReportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    hospital: { type: String, required: true },
    diagnosis: { type: String, required: true },
    date: { type: String, default: '' },
    days: { type: Number, default: 1 },
    status: { type: String, enum: ['Bekliyor', 'Onaylandı', 'Reddedildi'], default: 'Bekliyor' }
}, { timestamps: true });

HealthReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('HealthReport', HealthReportSchema);
