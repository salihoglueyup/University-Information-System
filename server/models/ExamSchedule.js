const mongoose = require('mongoose');

// A user's exam-schedule entry (per exam slot, with assigned seat), keyed by username.
const ExamScheduleSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    room: { type: String, default: '' },
    seat: { type: String, default: '' },
    type: { type: String, default: '' }
}, { timestamps: true });

ExamScheduleSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('ExamSchedule', ExamScheduleSchema);
