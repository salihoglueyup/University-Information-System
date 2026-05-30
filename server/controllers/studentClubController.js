const studentClubService = require('../services/studentClubService');

class StudentClubController {
    async list(req, res, next) {
        try {
            res.status(200).json(await studentClubService.list());
        } catch (err) { next(err); }
    }

    async join(req, res, next) {
        try {
            const result = await studentClubService.join(req.user && req.user.username, req.params.id);
            res.status(201).json(result);
        } catch (err) { next(err); }
    }
}

module.exports = new StudentClubController();
