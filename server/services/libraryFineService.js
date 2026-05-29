const LibraryFine = require('../models/LibraryFine');
const AppError = require('../utils/AppError');

exports.list = async (username) => {
    return LibraryFine.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

exports.pay = async (username, id) => {
    const updated = await LibraryFine.findOneAndUpdate(
        { _id: id, userId: username, status: 'Ödenmedi' },
        { status: 'Ödendi', paidDate: new Date().toISOString().slice(0, 10) },
        { new: true }
    );
    if (!updated) throw new AppError('Ödenecek ceza bulunamadı', 404);
    return updated;
};
