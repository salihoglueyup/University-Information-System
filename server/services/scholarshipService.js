const Scholarship = require('../models/Scholarship');
const AppError = require('../utils/AppError');

const VALID_TYPES = ['KYK', 'Vakıf', 'Özel', 'Başarı', 'İndirim'];

exports.list = async (username) => {
    return Scholarship.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

// Student applies for a scholarship -> record created with status 'Başvuruldu'.
exports.apply = async (username, data) => {
    const { name, type, amount } = data || {};
    if (!name || !String(name).trim()) {
        throw new AppError('Burs adı gereklidir', 400);
    }
    return Scholarship.create({
        userId: username,
        name: String(name).trim(),
        type: VALID_TYPES.includes(type) ? type : 'Özel',
        amount: amount || '-',
        status: 'Başvuruldu'
    });
};
