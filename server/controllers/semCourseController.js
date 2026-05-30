const semCourseService = require('../services/semCourseService');

class SemCourseController {
    async list(req, res, next) {
        try {
            res.status(200).json(await semCourseService.list());
        } catch (err) { next(err); }
    }

    async enroll(req, res, next) {
        try {
            const result = await semCourseService.enroll(req.user && req.user.username, req.params.id);
            res.status(201).json(result);
        } catch (err) { next(err); }
    }
}

module.exports = new SemCourseController();
