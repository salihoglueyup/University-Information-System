const mongoose = require('mongoose');

// A term tuition fee for a student (keyed by username).
const TuitionFeeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    term: { type: String, default: '' },
    amount: { type: String, default: '0 ₺' },
    date: { type: String, default: '' },
    status: { type: String, enum: ['Ödendi', 'Ödenmedi'], default: 'Ödenmedi' },
    receipt: { type: Boolean, default: false },
    paidDate: { type: String, default: '' }
}, { timestamps: true });

TuitionFeeSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('TuitionFee', TuitionFeeSchema);
