const electronicExamService = require('../services/electronicExamService');

class ElectronicExamController {
    async list(req, res, next) {
        try {
            res.status(200).json(await electronicExamService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new ElectronicExamController();
