const mongoose = require('mongoose');

// A campus sports facility with live occupancy (global catalog).
const SportsFacilitySchema = new mongoose.Schema({
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: String, enum: ['Açık', 'Kapalı'], default: 'Açık' },
    occupancy: { type: Number, default: 0, min: 0, max: 100 },
    hours: { type: String, default: '' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SportsFacility', SportsFacilitySchema);
