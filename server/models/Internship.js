const mongoose = require('mongoose');

// A user's mandatory-internship status (one document per user).
const InternshipSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    mandatory: {
        completedDays: { type: Number, default: 0 },
        totalDays: { type: Number, default: 30 }
    },
    documents: [{
        name: String,
        status: { type: String, default: 'Bekliyor' }
    }],
    history: [{
        company: String,
        type: String,
        dates: String,
        days: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Internship', InternshipSchema);
