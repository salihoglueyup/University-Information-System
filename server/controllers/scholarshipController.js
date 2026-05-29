const scholarshipService = require('../services/scholarshipService');

class ScholarshipController {
    async list(req, res, next) {
        try {
            const items = await scholarshipService.list(req.user && req.user.username);
            res.status(200).json(items);
        } catch (err) {
            next(err);
        }
    }

    async apply(req, res, next) {
        try {
            const created = await scholarshipService.apply(req.user && req.user.username, req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ScholarshipController();
