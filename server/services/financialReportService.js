const FinancialReport = require('../models/FinancialReport');

exports.get = async () => {
    return FinancialReport.findOne().sort({ createdAt: -1 }).lean();
};
