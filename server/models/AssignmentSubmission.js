const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Teslim Edildi', 'Notlandirildi', 'Gecikmeli Teslim'],
        default: 'Teslim Edildi'
    },
    grade: {
        type: Number,
        default: null
    },
    feedback: {
        type: String
    }
}, { timestamps: true });

// A student can submit only once per assignment
AssignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
