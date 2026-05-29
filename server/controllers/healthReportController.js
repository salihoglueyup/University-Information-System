const healthReportService = require('../services/healthReportService');

class HealthReportController {
    async list(req, res, next) {
        try {
            const reports = await healthReportService.list(req.user && req.user.username);
            res.status(200).json(reports);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const created = await healthReportService.create(req.user && req.user.username, req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new HealthReportController();
