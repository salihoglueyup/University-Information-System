const SemCourse = require('../models/SemCourse');
const AppError = require('../utils/AppError');

exports.list = async () => {
    return SemCourse.find().sort({ order: 1, createdAt: 1 }).limit(100).lean();
};

exports.enroll = async (username, id) => {
    const updated = await SemCourse.findByIdAndUpdate(
        id,
        { $addToSet: { enrolledUserIds: username } },
        { new: true }
    );
    if (!updated) throw new AppError('Eğitim programı bulunamadı', 404);
    return { id: updated._id, title: updated.title, enrolled: true };
};
