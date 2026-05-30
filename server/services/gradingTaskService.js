const GradingTask = require('../models/GradingTask');

exports.list = async (username) => {
    return GradingTask.find({ userId: username }).sort({ dueDate: 1, createdAt: -1 }).limit(100).lean();
};
