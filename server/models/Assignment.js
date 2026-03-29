const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    dueDate: { // e.g. "2026-03-15T23:59:00Z" or formatted string
        type: String,
        required: true
    },
    daysLeft: {
        type: Number,
        default: 0
    },
    status: { // 'Bekliyor', 'Tamamlandı'
        type: String,
        required: true
    },
    type: { // 'Ödev', 'Proje'
        type: String,
        default: 'Ödev'
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
