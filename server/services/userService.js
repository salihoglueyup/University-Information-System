const User = require('../models/User');

exports.getUserProfile = async (id) => {
    const user = await User.findById(id);
    if (!user) return null;
    const { password: _password, ...others } = user._doc;
    return others;
};

exports.getAllUsers = async () => {
    return await User.find().select('-password');
};

exports.updateUser = async (id, updateData) => {
    const allowedFields = ['fullName', 'email', 'profilePicture', 'language', 'theme'];
    const sanitized = {};
    for (const key of allowedFields) {
        if (updateData[key] !== undefined) sanitized[key] = updateData[key];
    }
    return await User.findByIdAndUpdate(
        id,
        { $set: sanitized },
        { new: true }
    ).select('-password');
};

exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};
