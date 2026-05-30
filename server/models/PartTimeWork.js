const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
    date: { type: String, default: '' },
    hours: { type: String, default: '' },
    total: { type: Number, default: 0 }
}, { _id: false });

// A student's part-time (assistantship) assignment + timesheet (one per user).
const PartTimeWorkSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    role: { type: String, default: '' },
    department: { type: String, default: '' },
    status: { type: String, default: 'Aktif' },
    hourlyRate: { type: String, default: '0 ₺' },
    salary: { type: String, default: '0 ₺' },
    workedThisMonth: { type: String, default: '0 saat' },
    monthlyLimit: { type: String, default: '80 saat' },
    shifts: { type: [ShiftSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('PartTimeWork', PartTimeWorkSchema);
