const emailService = require('../services/emailService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getUserEmails = catchAsync(async (req, res, next) => {
    const data = await emailService.getUserEmails(req.user.id);
    if (!data) {
        return next(new AppError('Kullanıcı bulunamadı', 404));
    }
    res.status(200).json(data);
});

exports.sendEmail = catchAsync(async (req, res, next) => {
    const savedEmail = await emailService.sendEmail(req.user.id, req.body);
    if (!savedEmail) {
        return next(new AppError('Gönderici bulunamadı', 404));
    }

    // Emit via Socket.io to the receiver room
    const io = req.app.get("io");
    if (io) {
        io.to(req.body.receiver).emit("receive_email", savedEmail);
    }

    res.status(201).json(savedEmail);
});
