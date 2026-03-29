const studentService = require('../services/studentService');

class StudentController {
    async getAll(req, res, next) {
        try {
            const result = await studentService.getAllStudents(req.query);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const student = await studentService.getStudentById(req.params.id);
            res.status(200).json(student);
        } catch (err) {
            next(err);
        }
    }

    async get360(req, res, next) {
        try {
            const profile360 = await studentService.getStudent360(req.params.id);
            res.status(200).json(profile360);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();
