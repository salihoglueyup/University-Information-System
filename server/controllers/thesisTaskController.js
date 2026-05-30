const thesisTaskService = require('../services/thesisTaskService');

class ThesisTaskController {
    async board(req, res, next) {
        try {
            res.status(200).json(await thesisTaskService.getBoard(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async move(req, res, next) {
        try {
            const updated = await thesisTaskService.move(req.user && req.user.username, req.params.id, req.body.column);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }

    async reorder(req, res, next) {
        try {
            const updated = await thesisTaskService.reorder(req.user && req.user.username, req.params.id, req.body.newIndex);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new ThesisTaskController();
