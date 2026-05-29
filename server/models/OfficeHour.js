const mongoose = require('mongoose');

// A user's (advisor's) weekly office-hour slot.
const OfficeHourSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, default: '' },
    location: { type: String, default: '' }
}, { timestamps: true });

OfficeHourSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('OfficeHour', OfficeHourSchema);
