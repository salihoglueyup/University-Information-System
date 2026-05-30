const mongoose = require('mongoose');

// A campus shuttle (ring) route and its departure times (global catalog).
const ShuttleRouteSchema = new mongoose.Schema({
    route: { type: String, default: '' },
    times: { type: [String], default: [] },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ShuttleRoute', ShuttleRouteSchema);
