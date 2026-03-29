const mongoose = require('mongoose');

const DocumentVerificationSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    documentType: {
        type: String,
        default: 'Transkript'
    }
}, { timestamps: true });

module.exports = mongoose.model('DocumentVerification', DocumentVerificationSchema);
