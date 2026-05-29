const mongoose = require('mongoose');

// A user's registered campus vehicle / sticker application (keyed by username).
const VehicleSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    plate: { type: String, required: true, trim: true },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    owner: { type: String, default: '' },
    status: { type: String, enum: ['Beklemede', 'Aktif', 'Reddedildi', 'Pasif'], default: 'Beklemede' },
    validUntil: { type: String, default: '' }
}, { timestamps: true });

VehicleSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Vehicle', VehicleSchema);
