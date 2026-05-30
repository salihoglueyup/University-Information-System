const PartTimeWork = require('../models/PartTimeWork');
const AppError = require('../utils/AppError');

exports.get = async (username) => {
    return PartTimeWork.findOne({ userId: username }).lean();
};

exports.addShift = async (username, shift) => {
    const doc = await PartTimeWork.findOne({ userId: username });
    if (!doc) throw new AppError('Kısmi zamanlı çalışma kaydınız bulunamadı', 404);

    doc.shifts.unshift({ date: shift.date, hours: shift.hours || '', total: shift.total });
    const totalHours = doc.shifts.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    doc.workedThisMonth = `${totalHours} saat`;
    await doc.save();
    return doc.toObject();
};
