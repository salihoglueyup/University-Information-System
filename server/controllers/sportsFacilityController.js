const sportsFacilityService = require('../services/sportsFacilityService');

class SportsFacilityController {
    async list(req, res, next) {
        try {
            res.status(200).json(await sportsFacilityService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new SportsFacilityController();
