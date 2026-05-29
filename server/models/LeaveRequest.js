const mongoose = require('mongoose');

// Leave / assignment request raised by a user (keyed by username).
const LeaveRequestSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // username of the requester
    type: { type: String, default: 'Yıllık İzin' },
    reason: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    days: { type: Number, default: 0 },
    status: { type: String, enum: ['Bekliyor', 'Onaylandı', 'Reddedildi'], default: 'Bekliyor' }
}, { timestamps: true });

LeaveRequestSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
