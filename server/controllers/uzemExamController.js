const uzemExamService = require('../services/uzemExamService');

class UzemExamController {
    async list(req, res, next) {
        try {
            res.status(200).json(await uzemExamService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new UzemExamController();
