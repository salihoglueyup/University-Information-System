const ThesisStudent = require('../models/ThesisStudent');

exports.list = async (username) => {
    return ThesisStudent.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};
