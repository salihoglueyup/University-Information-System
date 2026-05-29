const mongoose = require('mongoose');

// Advisor appointment with a student (owned by the advisor/user via username).
const AppointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    student: { type: String, required: true },
    studentId: { type: String, default: '' },
    topic: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    type: { type: String, enum: ['Online', 'Yüz Yüze'], default: 'Yüz Yüze' },
    status: { type: String, enum: ['Bekliyor', 'Onaylandı', 'Reddedildi', 'Tamamlandı', 'İptal'], default: 'Bekliyor' }
}, { timestamps: true });

AppointmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
