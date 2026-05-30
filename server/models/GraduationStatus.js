const mongoose = require('mongoose');

// A student's graduation eligibility snapshot (one per user).
const GraduationStatusSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalCredits: { type: Number, default: 0 },
    requiredCredits: { type: Number, default: 240 },
    gpa: { type: Number, default: 0 },
    internshipStatus: { type: String, default: 'Bekliyor' },
    libraryStatus: { type: String, default: 'Temiz' },
    thesisStatus: { type: String, default: 'Bekliyor' }
}, { timestamps: true });

module.exports = mongoose.model('GraduationStatus', GraduationStatusSchema);
