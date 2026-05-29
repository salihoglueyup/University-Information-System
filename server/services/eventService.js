const Event = require('../models/Event');

exports.list = async () => {
    return Event.find().sort({ createdAt: -1 }).limit(50).lean();
};
