const accessLogService = require('../services/accessLogService');

class AccessLogController {
    async list(req, res, next) {
        try {
            res.status(200).json(await accessLogService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new AccessLogController();
