const graduationStatusService = require('../services/graduationStatusService');

class GraduationStatusController {
    async get(req, res, next) {
        try {
            res.status(200).json(await graduationStatusService.get(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new GraduationStatusController();
