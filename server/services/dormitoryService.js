const Dormitory = require('../models/Dormitory');
const User = require('../models/User');

exports.getDormitoryInfo = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    const dormData = await Dormitory.findOne({ studentNo: user.username }).lean();
    return dormData;
};
