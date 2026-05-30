const examApplicationService = require('../services/examApplicationService');

class ExamApplicationController {
    async list(req, res, next) {
        try {
            res.status(200).json(await examApplicationService.list());
        } catch (err) { next(err); }
    }

    async apply(req, res, next) {
        try {
            const result = await examApplicationService.apply(req.user && req.user.username, req.params.id);
            res.status(201).json(result);
        } catch (err) { next(err); }
    }
}

module.exports = new ExamApplicationController();
