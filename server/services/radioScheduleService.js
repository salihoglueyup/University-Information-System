const RadioSchedule = require('../models/RadioSchedule');

exports.list = async () => {
    return RadioSchedule.find().sort({ order: 1, time: 1 }).limit(50).lean();
};
