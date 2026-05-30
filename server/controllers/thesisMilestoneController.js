const thesisMilestoneService = require('../services/thesisMilestoneService');

class ThesisMilestoneController {
    async get(req, res, next) {
        try {
            res.status(200).json(await thesisMilestoneService.get(req.params.thesisId));
        } catch (err) { next(err); }
    }
}

module.exports = new ThesisMilestoneController();
