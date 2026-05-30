const mongoose = require('mongoose');

// A medical-center (poliklinik) appointment booked by a user (keyed by username).
const HealthAppointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    department: { type: String, default: '' },
    doctor: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' }
}, { timestamps: true });

HealthAppointmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('HealthAppointment', HealthAppointmentSchema);
