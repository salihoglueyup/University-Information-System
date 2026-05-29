const lostFoundService = require('../services/lostFoundService');

class LostFoundController {
    async list(req, res, next) {
        try {
            const items = await lostFoundService.list({ type: req.query.type, search: req.query.search });
            res.status(200).json(items);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const created = await lostFoundService.create(req.body, req.user && req.user.username);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LostFoundController();
