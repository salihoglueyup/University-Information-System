const OnlineCourse = require('../models/OnlineCourse');

exports.list = async (username) => {
    return OnlineCourse.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};
