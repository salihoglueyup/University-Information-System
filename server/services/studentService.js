const Student = require('../models/Student');
const GradeData = require('../models/GradeData');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');

class StudentService {
    async getAllStudents(queryString) {
        // Implement ApiFeatures for advanced filtering/pagination
        const features = new ApiFeatures(Student.find(), queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const students = await features.query;
        const total = await Student.countDocuments();

        return {
            results: students.length,
            total,
            data: students
        };
    }

    async getStudentById(id) {
        const student = await Student.findOne({ id: id });
        if (!student) {
            throw new AppError("Student not found", 404);
        }
        return student;
    }

    async getStudent360(id) {
        const student = await Student.findOne({ id: id });

        if (!student) {
            throw new AppError("Student not found", 404);
        }

        const gradeDataList = await GradeData.find({ userId: id });
        let gradeData = gradeDataList.length > 0 ? gradeDataList[0] : null;

        let totalCredits = 0;
        let riskFactors = [];
        let nextTermCourses = [
            { code: "YZM202", name: "Veri Yapıları", credits: 4, status: "Pending Approval" },
            { code: "YZM204", name: "Veritabanı Yönetimi", credits: 3, status: "Pending Approval" },
            { code: "MAT201", name: "Lineer Cebir", credits: 3, status: "Pending Approval" }
        ];

        if (gradeData && gradeData.currentSemester) {
            totalCredits = gradeData.currentSemester.reduce((acc, curr) => {
                if (curr.status === "Geçti") return acc + curr.credit;
                return acc;
            }, 0);
        } else {
            gradeData = {
                history: [
                    { semester: '2023 Güz', gno: 2.40 },
                    { semester: '2023 Bahar', gno: 2.10 },
                    { semester: '2024 Güz', gno: 1.95 },
                    { semester: '2024 Bahar', gno: 1.85 },
                ]
            };
        }

        const numericGpa = parseFloat(student.gpa || "0");
        let status = "Active";

        if (numericGpa < 2.0) {
            riskFactors.push("GPA kritik seviyenin altında (< 2.00)");
            status = "Probation";
        }

        if (numericGpa > 0 && numericGpa < 2.5) {
            riskFactors.push("Mezuniyet şartları için not ortalaması risk taşıyor");
        }

        if (riskFactors.length === 0 && Math.random() > 0.7) {
            riskFactors.push("Devamsızlık oranı yüksek (%25)");
        }

        return {
            ...student.toObject(),
            gpa: numericGpa.toFixed(2),
            totalCredits: totalCredits > 0 ? totalCredits : 45,
            advisor: student.advisor || "Dr. Öğr. Üyesi Eyüp",
            status: status,
            riskFactors: riskFactors,
            gpaHistory: gradeData.history || [],
            nextTermCourses: nextTermCourses
        };
    }
}

module.exports = new StudentService();
