const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false
    },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    gpa: { type: Number },
    semester: { type: Number },
    status: { type: String },

    // Detailed Info
    email: { type: String },
    tcNo: { type: String },
    nationality: { type: String },
    birthDate: { type: Date },
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
    registrationDate: { type: Date },
    advisor: { type: String },
    scholarship: { type: String },

    // Education History
    highSchool: { type: String },
    graduationYear: { type: Number },
    diplomaGrade: { type: String },

    // YKS Data
    examYear: { type: Number },
    examScore: { type: String },
    placementRank: { type: String }
}, { timestamps: true });

StudentSchema.index({ faculty: 1, department: 1 });
StudentSchema.index({ status: 1 });
StudentSchema.index({ email: 1 });
StudentSchema.index({ userId: 1 });

module.exports = mongoose.model('Student', StudentSchema);
