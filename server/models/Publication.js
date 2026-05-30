const mongoose = require('mongoose');

// An academic publication for incentive-point tracking (keyed by username).
const PublicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, default: '' },
    type: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    points: { type: Number, default: 0 },
    status: { type: String, default: 'Yayınlandı' }
}, { timestamps: true });

PublicationSchema.index({ userId: 1, year: -1 });

module.exports = mongoose.model('Publication', PublicationSchema);
