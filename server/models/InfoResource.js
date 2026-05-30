const mongoose = require('mongoose');

// A library/info-center electronic resource (global catalog).
const InfoResourceSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    url: { type: String, default: '' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InfoResource', InfoResourceSchema);
