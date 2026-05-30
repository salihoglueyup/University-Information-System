const gradingTaskService = require('../services/gradingTaskService');

class GradingTaskController {
    async list(req, res, next) {
        try {
            res.status(200).json(await gradingTaskService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new GradingTaskController();
