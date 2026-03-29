const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true }, // positive for income, negative for expense
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true }, // e.g. 'Yemek', 'Ceza', 'Transfer'
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
