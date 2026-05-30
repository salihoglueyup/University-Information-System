const UzemExam = require('../models/UzemExam');

exports.list = async (username) => {
    return UzemExam.find({ userId: username }).sort({ date: 1 }).limit(50).lean();
};
