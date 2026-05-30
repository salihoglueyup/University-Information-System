const examSessionService = require('../services/examSessionService');

class ExamSessionController {
    async list(req, res, next) {
        try {
            res.status(200).json(await examSessionService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new ExamSessionController();
