const HealthReport = require('../models/HealthReport');

exports.list = async (username) => {
    return HealthReport.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

// Body is already validated by the `healthReport` Zod schema at the route layer.
exports.create = async (username, data) => {
    const { hospital, diagnosis, date, days } = data;
    return HealthReport.create({ userId: username, hospital, diagnosis, date, days });
};
