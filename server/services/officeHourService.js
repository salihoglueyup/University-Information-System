const OfficeHour = require('../models/OfficeHour');

exports.list = async (username) => {
    return OfficeHour.find({ userId: username }).sort({ createdAt: 1 }).limit(50).lean();
};

exports.create = async (username, data) => {
    const { day, time, location } = data;
    return OfficeHour.create({ userId: username, day, time, location });
};
