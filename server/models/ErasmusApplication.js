const mongoose = require('mongoose');

// Erasmus / exchange application by a user (keyed by username).
const ErasmusApplicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    year: { type: String, default: '' },
    term: { type: String, default: '' },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['Başvuru Alındı', 'Asil', 'Yedek', 'Reddedildi'], default: 'Başvuru Alındı' }
}, { timestamps: true });

ErasmusApplicationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ErasmusApplication', ErasmusApplicationSchema);
