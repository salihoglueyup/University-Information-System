const erasmusService = require('../services/erasmusService');

class ErasmusController {
    async listApplications(req, res, next) {
        try {
            res.status(200).json(await erasmusService.listApplications(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async createApplication(req, res, next) {
        try {
            res.status(201).json(await erasmusService.createApplication(req.user && req.user.username, req.body));
        } catch (err) { next(err); }
    }

    async listChoices(req, res, next) {
        try {
            res.status(200).json(await erasmusService.listChoices(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async createChoice(req, res, next) {
        try {
            res.status(201).json(await erasmusService.createChoice(req.user && req.user.username, req.body));
        } catch (err) { next(err); }
    }
}

module.exports = new ErasmusController();
