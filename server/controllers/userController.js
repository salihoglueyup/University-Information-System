const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUserProfile = catchAsync(async (req, res, next) => {
    const user = await userService.getUserProfile(req.user.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json(user);
});

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
});

exports.createUser = catchAsync(async (req, res) => {
    const created = await userService.createUser(req.body);
    res.status(201).json(created);
});

exports.updateUser = catchAsync(async (req, res) => {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
});

exports.deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
});
