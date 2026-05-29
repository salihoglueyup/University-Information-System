const mongoose = require('mongoose');

// A scholarship/discount held by, or applied for, by a user (keyed by username).
const ScholarshipSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, default: 'Özel' },
    amount: { type: String, default: '-' },
    paymentDate: { type: String, default: '' },
    status: { type: String, enum: ['Aktif', 'Başvuruldu', 'Reddedildi', 'Pasif'], default: 'Başvuruldu' }
}, { timestamps: true });

ScholarshipSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
