const questionService = require('../services/questionService');

class QuestionController {
    async list(req, res, next) {
        try {
            res.status(200).json(await questionService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async create(req, res, next) {
        try {
            res.status(201).json(await questionService.create(req.user && req.user.username, req.body));
        } catch (err) { next(err); }
    }

    async remove(req, res, next) {
        try {
            await questionService.remove(req.user && req.user.username, req.params.id);
            res.status(204).end();
        } catch (err) { next(err); }
    }
}

module.exports = new QuestionController();
