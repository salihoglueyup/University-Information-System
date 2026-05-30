const SportsFacility = require('../models/SportsFacility');

exports.list = async () => {
    return SportsFacility.find().sort({ order: 1, name: 1 }).limit(50).lean();
};
