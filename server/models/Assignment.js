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
    dueDate: {
        type: Date,
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

AssignmentSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
