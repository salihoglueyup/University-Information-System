const ExamResult = require('../models/ExamResult');
const ExamSchedule = require('../models/ExamSchedule');

exports.listResults = async (username) => {
    return ExamResult.find({ userId: username }).sort({ createdAt: -1 }).limit(50).lean();
};

exports.listSchedule = async (username) => {
    return ExamSchedule.find({ userId: username }).sort({ date: 1 }).limit(50).lean();
};
