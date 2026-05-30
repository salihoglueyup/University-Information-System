const ThesisAssistance = require('../models/ThesisAssistance');

exports.list = async (username) => {
    return ThesisAssistance.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};
