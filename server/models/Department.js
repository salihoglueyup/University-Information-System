const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    facultyId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
