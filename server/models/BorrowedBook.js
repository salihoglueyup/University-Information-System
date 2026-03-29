const mongoose = require('mongoose');

const BorrowedBookSchema = new mongoose.Schema({
    studentNo: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ['Okunuyor', 'Süresi Yaklaşıyor', 'Gecikti'], default: 'Okunuyor' },
    cover: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BorrowedBook', BorrowedBookSchema);
