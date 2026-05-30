const mongoose = require('mongoose');

// A course in a department's curriculum (global catalog).
const DepartmentCourseSchema = new mongoose.Schema({
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    credit: { type: Number, default: 0 },
    ects: { type: Number, default: 0 },
    semester: { type: Number, default: 1 },
    type: { type: String, enum: ['Zorunlu', 'Seçmeli'], default: 'Zorunlu' }
}, { timestamps: true });

DepartmentCourseSchema.index({ semester: 1, code: 1 });

module.exports = mongoose.model('DepartmentCourse', DepartmentCourseSchema);
