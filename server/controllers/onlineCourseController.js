const onlineCourseService = require('../services/onlineCourseService');

class OnlineCourseController {
    async list(req, res, next) {
        try {
            res.status(200).json(await onlineCourseService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new OnlineCourseController();
