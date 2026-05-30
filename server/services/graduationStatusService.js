const GraduationStatus = require('../models/GraduationStatus');

exports.get = async (username) => {
    return GraduationStatus.findOne({ userId: username }).lean();
};
