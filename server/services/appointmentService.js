const Appointment = require('../models/Appointment');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return Appointment.find({ userId: username }).sort({ createdAt: -1 }).limit(200).lean();
};

exports.create = async (username, data) => {
    const { student, studentId, topic, date, time, type } = data;
    return Appointment.create({ userId: username, student, studentId, topic, date, time, type });
};

exports.updateStatus = async (username, id, status) => {
    const updated = await Appointment.findOneAndUpdate(
        { _id: id, userId: username },
        { status },
        { new: true }
    );
    if (!updated) throw new AppError('Randevu bulunamadı', 404);
    return updated;
};
