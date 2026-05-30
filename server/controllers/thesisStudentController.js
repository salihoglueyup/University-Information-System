const thesisStudentService = require('../services/thesisStudentService');

class ThesisStudentController {
    async list(req, res, next) {
        try {
            res.status(200).json(await thesisStudentService.list(req.user && req.user.username));
        } catch (err) { next(err); }
    }
}

module.exports = new ThesisStudentController();
