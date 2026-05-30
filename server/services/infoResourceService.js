const InfoResource = require('../models/InfoResource');

exports.list = async () => {
    return InfoResource.find().sort({ order: 1, name: 1 }).limit(100).lean();
};
