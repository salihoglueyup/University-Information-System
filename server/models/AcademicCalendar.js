const mongoose = require('mongoose');

const AcademicCalendarSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    events: [{
        day: Number,
        title: String,
        type: { type: String } // 'Academic', 'Deadline', 'Exam'
    }]
}, { timestamps: true });

module.exports = mongoose.model('AcademicCalendar', AcademicCalendarSchema);
