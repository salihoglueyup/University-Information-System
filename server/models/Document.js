const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ['Dilekçe', 'Staj Evrağı', 'Transkript Talebi', 'Diğer', 'Kimlik Fotokopisi'], default: 'Dilekçe' },
    status: { type: String, enum: ['Onaylandı', 'Bekliyor', 'Reddedildi'], default: 'Bekliyor' },
    size: { type: Number } // bytes
}, { timestamps: true });

DocumentSchema.index({ userId: 1, createdAt: -1 });
DocumentSchema.index({ status: 1 });

module.exports = mongoose.model('Document', DocumentSchema);
