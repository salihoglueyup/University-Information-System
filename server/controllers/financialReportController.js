const financialReportService = require('../services/financialReportService');

class FinancialReportController {
    async get(req, res, next) {
        try {
            res.status(200).json(await financialReportService.get());
        } catch (err) { next(err); }
    }
}

module.exports = new FinancialReportController();
