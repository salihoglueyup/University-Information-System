const AccessLog = require('../models/AccessLog');

exports.list = async (username) => {
    return AccessLog.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};
