const mongoose = require('mongoose');

const GradeDataSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    currentSemester: [{
        code: String,
        name: String,
        credit: Number,
        ects: Number,
        midterm: Number,
        final: Number,
        letter: String,
        status: String
    }],
    history: [{
        semester: String,
        gno: Number
    }],
    distribution: [{
        name: String,
        value: Number
    }]
}, { timestamps: true });

GradeDataSchema.index({ userId: 1 });

module.exports = mongoose.model('GradeData', GradeDataSchema);
