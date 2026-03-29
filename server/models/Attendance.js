const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'all'
    },
    code: String,
    name: String,
    total: Number,
    attended: Number,
    absent: Number,
    percent: Number
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
