const syllabusService = require('../services/syllabusService');

class SyllabusController {
    async list(req, res, next) {
        try {
            res.status(200).json(await syllabusService.list(req.query.courseId));
        } catch (err) { next(err); }
    }
}

module.exports = new SyllabusController();
