const OfficeHour = require('../models/OfficeHour');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return OfficeHour.find({ userId: username }).sort({ createdAt: 1 }).limit(50).lean();
};

exports.create = async (username, data) => {
    const { day, time, location } = data;
    return OfficeHour.create({ userId: username, day, time, location });
};

exports.remove = async (username, id) => {
    const deleted = await OfficeHour.findOneAndDelete({ _id: id, userId: username });
    if (!deleted) throw new AppError('Ofis saati bulunamadı', 404);
    return deleted;
};
