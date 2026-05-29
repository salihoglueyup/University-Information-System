const leaveService = require('../services/leaveService');

class LeaveController {
    async list(req, res, next) {
        try {
            const requests = await leaveService.list(req.user && req.user.username);
            res.status(200).json(requests);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const created = await leaveService.create(req.user && req.user.username, req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LeaveController();
