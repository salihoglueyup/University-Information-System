const mongoose = require('mongoose');

// A slot in the university radio/TV broadcast schedule (global catalog).
const RadioScheduleSchema = new mongoose.Schema({
    time: { type: String, default: '' },
    program: { type: String, default: '' },
    host: { type: String, default: '' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('RadioSchedule', RadioScheduleSchema);
