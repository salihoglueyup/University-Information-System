const instructorCourseService = require('../services/instructorCourseService');

class InstructorCourseController {
    async list(req, res, next) {
        try {
            res.status(200).json(await instructorCourseService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new InstructorCourseController();
