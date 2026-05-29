const Contract = require('../models/Contract');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return Contract.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

exports.updateStatus = async (username, id, status) => {
    const update = { status };
    // Stamp the approval date when the user signs.
    if (status === 'Onaylandı') update.date = new Date().toISOString().slice(0, 10);
    const updated = await Contract.findOneAndUpdate(
        { _id: id, userId: username },
        update,
        { new: true }
    );
    if (!updated) throw new AppError('Sözleşme bulunamadı', 404);
    return updated;
};
