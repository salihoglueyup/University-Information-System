const supportService = require('../services/supportService');

class SupportController {
    async list(req, res, next) {
        try {
            const tickets = await supportService.list(req.user && req.user.username);
            res.status(200).json(tickets);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const created = await supportService.create(req.user && req.user.username, req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SupportController();
