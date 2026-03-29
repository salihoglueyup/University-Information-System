const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
