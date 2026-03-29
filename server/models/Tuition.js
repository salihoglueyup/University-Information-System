const mongoose = require('mongoose');

const TuitionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    scholarship: { type: String, required: true },
    paidAmount: { type: Number, default: 0 },
    installments: [{
        term: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ['Ödendi', 'Ödenmedi'], default: 'Ödenmedi' },
        date: { type: Date, required: true },
        method: { type: String, default: "-" },
        receipt: { type: String }
    }]
});

module.exports = mongoose.model('Tuition', TuitionSchema);
