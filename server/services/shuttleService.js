const ShuttleRoute = require('../models/ShuttleRoute');

exports.list = async () => {
    return ShuttleRoute.find().sort({ order: 1, route: 1 }).limit(50).lean();
};
