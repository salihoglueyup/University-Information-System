const examService = require('../services/examService');

class ExamController {
    async listResults(req, res, next) {
        try {
            res.status(200).json(await examService.listResults(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async listSchedule(req, res, next) {
        try {
            res.status(200).json(await examService.listSchedule(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new ExamController();
