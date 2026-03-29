const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    subject: { type: String, required: true },
    preview: { type: String, required: true },
    read: { type: Boolean, default: false },
    folder: { type: String, enum: ['Gelen Kutusu', 'Arşiv', 'Çöp Kutusu', 'Yıldızlı'], default: 'Gelen Kutusu' },
    date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Email', EmailSchema);
