const ProctoringDuty = require('../models/ProctoringDuty');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return ProctoringDuty.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

exports.confirm = async (username, id) => {
    const updated = await ProctoringDuty.findOneAndUpdate(
        { _id: id, userId: username, status: 'pending' },
        { status: 'confirmed', confirmedDate: new Date().toISOString().slice(0, 10) },
        { new: true }
    );
    if (!updated) throw new AppError('Onaylanacak görev bulunamadı', 404);
    return updated;
};
