const mongoose = require('mongoose');

// A library fine for a late/lost book (keyed by username).
const LibraryFineSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    book: { type: String, default: '' },
    fine: { type: String, default: '0 ₺' },
    returnDate: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    status: { type: String, enum: ['Ödenmedi', 'Ödendi'], default: 'Ödenmedi' },
    paidDate: { type: String, default: '' }
}, { timestamps: true });

LibraryFineSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('LibraryFine', LibraryFineSchema);
