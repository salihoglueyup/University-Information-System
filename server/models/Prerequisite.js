const mongoose = require('mongoose');

// A course and the courses that must be passed before taking it (global catalog).
const PrerequisiteSchema = new mongoose.Schema({
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    prerequisites: { type: [String], default: [] },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Prerequisite', PrerequisiteSchema);
