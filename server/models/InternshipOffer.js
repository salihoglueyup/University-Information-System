const mongoose = require('mongoose');

// Global internship job listings shown on the "Staj İlanları" tab.
const InternshipOfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    deadline: { type: String, default: '' },
    type: { type: String, default: 'Staj' }
}, { timestamps: true });

module.exports = mongoose.model('InternshipOffer', InternshipOfferSchema);
