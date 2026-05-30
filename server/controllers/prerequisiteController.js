const prerequisiteService = require('../services/prerequisiteService');

class PrerequisiteController {
    async list(req, res, next) {
        try {
            res.status(200).json(await prerequisiteService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new PrerequisiteController();
