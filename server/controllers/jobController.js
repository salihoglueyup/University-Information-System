const jobService = require('../services/jobService');

class JobController {
    async list(req, res, next) {
        try {
            res.status(200).json(await jobService.list());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new JobController();
