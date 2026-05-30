const TuitionFee = require('../models/TuitionFee');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return TuitionFee.find({ userId: username }).sort({ createdAt: -1 }).limit(50).lean();
};

exports.pay = async (username, id) => {
    const updated = await TuitionFee.findOneAndUpdate(
        { _id: id, userId: username, status: 'Ödenmedi' },
        { status: 'Ödendi', receipt: true, paidDate: new Date().toISOString().slice(0, 10) },
        { new: true }
    );
    if (!updated) throw new AppError('Ödenecek harç bulunamadı', 404);
    return updated;
};
