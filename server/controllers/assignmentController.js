const assignmentService = require('../services/assignmentService');
const AppError = require('../utils/AppError');

class AssignmentController {
    // Wrap async functions with a simple catchAsync logic or try-catch
    // Better to use try-catch here if we don't have a catchAsync wrapper yet.

    async getAll(req, res, next) {
        try {
            const result = await assignmentService.getAllAssignments(req.query);
            res.status(200).json(result);
        } catch (err) {
            next(err); // Passes error to the global errorHandler
        }
    }

    async create(req, res, next) {
        try {
            const result = await assignmentService.createAssignment(req.body);

            // Emit Real-time Notification
            const io = req.app.get('io');
            if (io) {
                // Emit to all connected clients. In a real scenario, this could be filtered by enrolled students.
                io.emit('new_assignment', {
                    title: result.title,
                    course: result.course,
                    message: `Yeni bir ödev eklendi: ${result.title} (${result.course})`
                });
            }

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    async submit(req, res, next) {
        try {
            if (!req.file) {
                return next(new AppError('Please provide a file to upload.', 400));
            }

            const assignmentId = req.params.id;
            // req.user logic is assumed to be added by verifyToken middleware later
            // if verifyToken is not applied, this defaults to user id or a dummy
            const studentId = req.user ? req.user.id : req.body.studentId;

            if (!studentId) {
                return next(new AppError('Student Information Missing in Token or Request Body.', 400));
            }

            const result = await assignmentService.submitAssignment(assignmentId, studentId, req.file);

            res.status(201).json({
                status: 'success',
                message: 'Assignment submitted successfully!',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AssignmentController();
