const courseService = require('../services/courseService');

class CourseController {
    async getAll(req, res, next) {
        try {
            const courses = await courseService.getAllCourses();
            res.status(200).json(courses);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const course = await courseService.createCourse(req.body);
            res.status(201).json(course);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CourseController();
