const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    cover: { type: String },
    available: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
