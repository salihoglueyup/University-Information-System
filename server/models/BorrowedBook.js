const mongoose = require('mongoose');

const BorrowedBookSchema = new mongoose.Schema({
    studentNo: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Okunuyor', 'Süresi Yaklaşıyor', 'Gecikti'], default: 'Okunuyor' },
    cover: { type: String }
}, { timestamps: true });

BorrowedBookSchema.index({ studentNo: 1 });
BorrowedBookSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
