const DeptTask = require('../models/DeptTask');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return DeptTask.find({ userId: username }).sort({ createdAt: -1 }).limit(200).lean();
};

exports.setStatus = async (username, id, status) => {
    const updated = await DeptTask.findOneAndUpdate(
        { _id: id, userId: username },
        { status },
        { new: true }
    );
    if (!updated) throw new AppError('Görev bulunamadı', 404);
    return updated;
};
