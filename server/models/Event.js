const mongoose = require('mongoose');

// Campus event / conference / festival listing (admin-managed, shown to all users).
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, default: 'Etkinlik' },
    image: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
