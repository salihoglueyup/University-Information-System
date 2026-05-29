const mongoose = require('mongoose');

// Persisted user notification so messages aren't lost when the user is offline.
// `recipient` matches the key the notification was addressed to (userId or username).
const NotificationSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    title: { type: String, default: 'Sistem Bildirimi' },
    message: { type: String, default: '' },
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false }
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
