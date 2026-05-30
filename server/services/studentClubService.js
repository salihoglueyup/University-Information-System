const StudentClub = require('../models/StudentClub');
const AppError = require('../utils/AppError');

exports.list = async () => {
    return StudentClub.find().sort({ order: 1, name: 1 }).limit(100).lean();
};

exports.join = async (username, id) => {
    const club = await StudentClub.findById(id);
    if (!club) throw new AppError('Kulüp bulunamadı', 404);

    if (!club.memberUserIds.includes(username)) {
        club.memberUserIds.push(username);
        club.members = (club.members || 0) + 1;
        await club.save();
    }
    return { id: club._id, name: club.name, members: club.members, joined: true };
};
