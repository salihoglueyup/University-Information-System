const HealthAppointment = require('../models/HealthAppointment');

exports.list = async (username) => {
    return HealthAppointment.find({ userId: username }).sort({ createdAt: -1 }).limit(50).lean();
};

exports.create = async (username, data) => {
    const { department, doctor, date, time } = data;
    return HealthAppointment.create({ userId: username, department, doctor, date, time });
};
