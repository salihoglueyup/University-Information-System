const proctoringService = require('../services/proctoringService');

class ProctoringController {
    async list(req, res, next) {
        try {
            res.status(200).json(await proctoringService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async confirm(req, res, next) {
        try {
            const updated = await proctoringService.confirm(req.user && req.user.username, req.params.id);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new ProctoringController();
