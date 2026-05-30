const mongoose = require('mongoose');

// A course in the institution-wide catalog (global, admin-managed).
const CatalogCourseSchema = new mongoose.Schema({
    code: { type: String, default: '' },
    courseName: { type: String, default: '' },
    department: { type: String, default: '' },
    credit: { type: Number, default: 0 },
    ects: { type: Number, default: 0 },
    semester: { type: Number, default: 1 },
    type: { type: String, enum: ['Zorunlu', 'Seçmeli'], default: 'Zorunlu' }
}, { timestamps: true });

CatalogCourseSchema.index({ semester: 1, code: 1 });

module.exports = mongoose.model('CatalogCourse', CatalogCourseSchema);
