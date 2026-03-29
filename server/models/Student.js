const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    gpa: { type: String },
    semester: { type: Number },
    status: { type: String },

    // Detailed Info
    email: { type: String },
    tcNo: { type: String },
    nationality: { type: String },
    birthDate: { type: String },
    birthPlace: { type: String },
    gender: { type: String },
    phone: { type: String },
    personalEmail: { type: String },
    address: { type: String },
    emergencyContact: { type: String },

    // Program Info
    programLanguage: { type: String },
    educationType: { type: String },
    degreeLevel: { type: String },

    // Registration Details
    registrationType: { type: String },
    registrationDate: { type: String },
    advisor: { type: String },
    scholarship: { type: String },

    // Education History
    highSchool: { type: String },
    graduationYear: { type: String },
    diplomaGrade: { type: String },

    // YKS Data
    examYear: { type: String },
    examScore: { type: String },
    placementRank: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
