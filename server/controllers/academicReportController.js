const academicReportService = require('../services/academicReportService');

class AcademicReportController {
    async get(req, res, next) {
        try {
            res.status(200).json(await academicReportService.get());
        } catch (err) { next(err); }
    }
}

module.exports = new AcademicReportController();
