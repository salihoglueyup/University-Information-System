const academicProgressService = require('../services/academicProgressService');

class AcademicProgressController {
    async getProgress(req, res, next) {
        try {
            res.status(200).json(await academicProgressService.getProgress(req.user && req.user.username));
        } catch (err) { next(err); }
    }

    async addPublication(req, res, next) {
        try {
            const updated = await academicProgressService.addPublication(req.user && req.user.username, req.body);
            res.status(201).json(updated);
        } catch (err) { next(err); }
    }
}

module.exports = new AcademicProgressController();
