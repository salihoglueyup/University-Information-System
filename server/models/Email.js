const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    subject: { type: String, required: true },
    preview: { type: String, required: true },
    read: { type: Boolean, default: false },
    folder: { type: String, enum: ['Gelen Kutusu', 'Arşiv', 'Çöp Kutusu', 'Yıldızlı'], default: 'Gelen Kutusu' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

EmailSchema.index({ receiver: 1, read: 1, createdAt: -1 });
EmailSchema.index({ sender: 1, createdAt: -1 });
EmailSchema.index({ folder: 1 });

module.exports = mongoose.model('Email', EmailSchema);
