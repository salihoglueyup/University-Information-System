const deptTaskService = require('../services/deptTaskService');

class DeptTaskController {
    async list(req, res, next) {
        try {
            res.status(200).json(await deptTaskService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async setStatus(req, res, next) {
        try {
            const updated = await deptTaskService.setStatus(req.user && req.user.username, req.params.id, req.body.status);
            res.status(200).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new DeptTaskController();
