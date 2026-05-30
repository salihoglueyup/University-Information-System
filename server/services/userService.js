const User = require('../models/User');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');

// Admin-only: create a user with any role/academic title.
exports.createUser = async (data) => {
    const { username, password, fullName, email, role, academicTitle, faculty, department } = data;

    const existing = await User.findOne({ username });
    if (existing) throw new AppError('Username already exists', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await User.create({
        username,
        password: hashedPassword,
        fullName,
        email,
        role,
        academicTitle: academicTitle || '',
        faculty: faculty || '',
        department: department || ''
    });
    const { password: _pw, ...others } = created._doc;
    return others;
};

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
    const allowedFields = ['fullName', 'email', 'profilePicture', 'language', 'theme', 'role', 'academicTitle', 'faculty', 'department'];
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
