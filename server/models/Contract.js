const mongoose = require('mongoose');

// A digital contract / undertaking between the university and a user (by username).
const ContractSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, default: '' }, // approval date (set when signed)
    status: { type: String, enum: ['Onay Bekliyor', 'Onaylandı'], default: 'Onay Bekliyor' }
}, { timestamps: true });

ContractSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Contract', ContractSchema);
