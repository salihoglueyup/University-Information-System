const mongoose = require('mongoose');

// Lost & Found board entry. `type` distinguishes a found item from a lost report.
const LostFoundItemSchema = new mongoose.Schema({
    item: { type: String, required: true, trim: true },
    category: { type: String, default: 'Diğer' },
    location: { type: String, default: '' },
    type: { type: String, enum: ['found', 'lost'], default: 'lost' },
    status: { type: String, default: 'Beklemede' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    reportedBy: { type: String, default: '' } // username of the reporter
}, { timestamps: true });

LostFoundItemSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('LostFoundItem', LostFoundItemSchema);
