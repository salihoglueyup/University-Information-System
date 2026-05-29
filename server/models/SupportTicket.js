const mongoose = require('mongoose');

// Help-desk support ticket raised by a user (keyed by username).
const SupportTicketSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // username of the requester
    subject: { type: String, required: true, trim: true },
    category: { type: String, default: 'Diğer' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['Açık', 'İşlemde', 'Çözüldü'], default: 'Açık' }
}, { timestamps: true });

SupportTicketSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
