const thesisAssistanceService = require('../services/thesisAssistanceService');

class ThesisAssistanceController {
    async list(req, res, next) {
        try {
            res.status(200).json(await thesisAssistanceService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new ThesisAssistanceController();
