const mongoose = require('mongoose');

const FacultyStatSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    students: { type: Number, default: 0 }
}, { _id: false });

const EnrollmentTrendSchema = new mongoose.Schema({
    year: { type: String, default: '' },
    students: { type: Number, default: 0 }
}, { _id: false });

// Institution-wide academic report data (single global document).
const AcademicReportSchema = new mongoose.Schema({
    facultyStats: { type: [FacultyStatSchema], default: [] },
    enrollmentTrends: { type: [EnrollmentTrendSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('AcademicReport', AcademicReportSchema);
