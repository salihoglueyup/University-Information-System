const ElectronicExam = require('../models/ElectronicExam');

exports.list = async (username) => {
    return ElectronicExam.find({ userId: username }).sort({ createdAt: -1 }).limit(50).lean();
};
