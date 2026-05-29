const mongoose = require('mongoose');

// A user's Erasmus partner-university preference entry (keyed by username).
const ErasmusChoiceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    university: { type: String, required: true },
    country: { type: String, default: '' },
    quota: { type: Number, default: 0 }
}, { timestamps: true });

ErasmusChoiceSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('ErasmusChoice', ErasmusChoiceSchema);
