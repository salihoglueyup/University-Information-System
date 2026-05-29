const mongoose = require('mongoose');

// Daily cafeteria menu entry (admin-managed weekly list).
const DiningMenuSchema = new mongoose.Schema({
    day: { type: String, default: '' },
    date: { type: String, default: '' },
    soup: { type: String, default: '' },
    main: { type: String, default: '' },
    side: { type: String, default: '' },
    extra: { type: String, default: '' },
    calories: { type: Number, default: 0 },
    order: { type: Number, default: 0 } // for weekly ordering (Mon..Fri)
}, { timestamps: true });

module.exports = mongoose.model('DiningMenu', DiningMenuSchema);
