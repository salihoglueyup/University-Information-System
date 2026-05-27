const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    code: String,
    name: String,
    total: Number,
    attended: Number,
    absent: Number,
    percent: Number
}, { timestamps: true });

AttendanceSchema.index({ userId: 1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
