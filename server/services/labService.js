const LabSection = require('../models/LabSection');

exports.list = async (username) => {
    return LabSection.find({ userId: username }).sort({ createdAt: -1 }).limit(50).lean();
};
