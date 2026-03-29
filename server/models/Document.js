const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ['Dilekçe', 'Staj Evrağı', 'Transkript Talebi', 'Diğer', 'Kimlik Fotokopisi'], default: 'Dilekçe' },
    status: { type: String, enum: ['Onaylandı', 'Bekliyor', 'Reddedildi'], default: 'Bekliyor' },
    size: { type: String } // e.g., "245 KB"
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
