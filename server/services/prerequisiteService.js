const Prerequisite = require('../models/Prerequisite');

exports.list = async () => {
    return Prerequisite.find().sort({ order: 1, code: 1 }).limit(200).lean();
};
