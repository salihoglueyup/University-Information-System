const mongoose = require('mongoose');

// Job / internship listing (admin-managed, shown to all users).
const JobPostingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, default: '' },
    type: { type: String, enum: ['Staj', 'Yarı Zamanlı', 'Tam Zamanlı'], default: 'Tam Zamanlı' },
    location: { type: String, default: '' },
    deadline: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', JobPostingSchema);
