const mongoose = require('mongoose');

// A 360° virtual-tour spot on campus (global catalog).
const VirtualTourSpotSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('VirtualTourSpot', VirtualTourSpotSchema);
