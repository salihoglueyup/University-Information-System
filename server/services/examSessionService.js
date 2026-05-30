const ExamSession = require('../models/ExamSession');

exports.list = async () => {
    return ExamSession.find().sort({ date: 1, time: 1 }).limit(200).lean();
};
