const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    userId: { // Assuming schedule varies per student in the future, for now acts globally or per role
        type: String,
        default: 'all'
    },
    course: {
        type: String,
        required: true
    },
    type: { // 'Ders', 'Lab', 'Uygulama'
        type: String,
        required: true
    },
    day: { // 'Pazartesi', 'Salı'
        type: String,
        required: true
    },
    start: { // '09:00'
        type: String,
        required: true
    },
    end: { // '11:50'
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        default: 'Atanmadı'
    }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
