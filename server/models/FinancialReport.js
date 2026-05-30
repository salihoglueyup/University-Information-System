const mongoose = require('mongoose');

const PaymentStatSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    value: { type: Number, default: 0 },
    color: { type: String, default: '#3B82F6' }
}, { _id: false });

const MonthlyRevenueSchema = new mongoose.Schema({
    month: { type: String, default: '' },
    amount: { type: Number, default: 0 }
}, { _id: false });

// Institution-wide financial report data (single global document).
const FinancialReportSchema = new mongoose.Schema({
    paymentStats: { type: [PaymentStatSchema], default: [] },
    monthlyRevenue: { type: [MonthlyRevenueSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('FinancialReport', FinancialReportSchema);
