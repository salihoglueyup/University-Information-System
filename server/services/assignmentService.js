const Assignment = require('../models/Assignment');
const ApiFeatures = require('../utils/ApiFeatures');

class AssignmentService {
    async getAllAssignments(queryString) {
        // Execute Query using ApiFeatures
        const features = new ApiFeatures(Assignment.find(), queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const assignments = await features.query;

        // Also get total count for pagination metadata if needed
        const total = await Assignment.countDocuments();

        return {
            results: assignments.length,
            total,
            data: assignments
        };
    }

    async createAssignment(assignmentData) {
        const newAssignment = new Assignment(assignmentData);
        return await newAssignment.save();
    }

    async submitAssignment(assignmentId, studentId, fileData) {
        const AssignmentSubmission = require('../models/AssignmentSubmission');

        let submission = await AssignmentSubmission.findOne({ assignment: assignmentId, student: studentId });

        if (submission) {
            submission.fileUrl = fileData.path.replace(/\\/g, '/');
            submission.fileName = fileData.originalname;
            submission.status = 'Teslim Edildi';
            submission = await submission.save();
        } else {
            const newSubmission = new AssignmentSubmission({
                assignment: assignmentId,
                student: studentId,
                fileUrl: fileData.path.replace(/\\/g, '/'),
                fileName: fileData.originalname
            });
            submission = await newSubmission.save();
        }

        return submission;
    }
}

module.exports = new AssignmentService();
