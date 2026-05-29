const ErasmusApplication = require('../models/ErasmusApplication');
const ErasmusChoice = require('../models/ErasmusChoice');

exports.listApplications = async (username) => {
    return ErasmusApplication.find({ userId: username }).sort({ createdAt: -1 }).limit(50).lean();
};

exports.createApplication = async (username, data) => {
    const { year, term, score } = data;
    return ErasmusApplication.create({ userId: username, year, term, score });
};

exports.listChoices = async (username) => {
    return ErasmusChoice.find({ userId: username }).sort({ createdAt: 1 }).limit(50).lean();
};

exports.createChoice = async (username, data) => {
    const { university, country, quota } = data;
    return ErasmusChoice.create({ userId: username, university, country, quota });
};
