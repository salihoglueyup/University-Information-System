const AcademicReport = require('../models/AcademicReport');

exports.get = async () => {
    return AcademicReport.findOne().sort({ createdAt: -1 }).lean();
};
