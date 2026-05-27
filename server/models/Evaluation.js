const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    academicName: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true,
        default: 'Güz 2024'
    },
    ratings: {
        courseMaterial: { type: Number, min: 1, max: 5, required: true },
        teachingEffectiveness: { type: Number, min: 1, max: 5, required: true },
        fairGrading: { type: Number, min: 1, max: 5, required: true },
        overallSatisfaction: { type: Number, min: 1, max: 5, required: true }
    },
    comments: {
        type: String,
        trim: true
    },
    isAnonymous: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

evaluationSchema.index({ student: 1 });
evaluationSchema.index({ academicName: 1 });

module.exports = mongoose.model('Evaluation', evaluationSchema);
