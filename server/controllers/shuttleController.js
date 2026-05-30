const shuttleService = require('../services/shuttleService');

class ShuttleController {
    async list(req, res, next) {
        try {
            res.status(200).json(await shuttleService.list());
        } catch (err) { next(err); }
    }
}

module.exports = new ShuttleController();
