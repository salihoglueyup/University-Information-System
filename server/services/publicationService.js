const Publication = require('../models/Publication');

exports.list = async (username) => {
    return Publication.find({ userId: username }).sort({ year: -1, createdAt: -1 }).limit(200).lean();
};
