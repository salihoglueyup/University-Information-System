const partTimeWorkService = require('../services/partTimeWorkService');

class PartTimeWorkController {
    async get(req, res, next) {
        try {
            res.status(200).json(await partTimeWorkService.get(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async addShift(req, res, next) {
        try {
            const updated = await partTimeWorkService.addShift(req.user && req.user.username, req.body);
            res.status(201).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new PartTimeWorkController();
