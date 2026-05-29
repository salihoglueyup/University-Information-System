const labService = require('../services/labService');

class LabController {
    async list(req, res, next) {
        try {
            res.status(200).json(await labService.list(req.user && req.user.username));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LabController();
