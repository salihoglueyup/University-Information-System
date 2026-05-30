const mongoose = require('mongoose');

// A campus card-access entry/exit event for a user (keyed by username).
const AccessLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    location: { type: String, default: '' },
    type: { type: String, enum: ['Giriş', 'Çıkış'], default: 'Giriş' },
    time: { type: String, default: '' }
}, { timestamps: true });

AccessLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AccessLog', AccessLogSchema);
