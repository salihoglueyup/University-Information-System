const mongoose = require('mongoose');

// A single course row in a student's official transcript (keyed by username).
const TranscriptEntrySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    semester: { type: String, default: '' },
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    credit: { type: Number, default: 0 },
    ects: { type: Number, default: 0 },
    letter: { type: String, default: '' },
    final: { type: Number, default: 0 },
    status: { type: String, default: '' },
    termGpa: { type: Number, default: 0 },
    cumGpa: { type: Number, default: 0 }
}, { timestamps: true });

TranscriptEntrySchema.index({ userId: 1, semester: 1 });

module.exports = mongoose.model('TranscriptEntry', TranscriptEntrySchema);
