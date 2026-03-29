const dormitoryService = require('../services/dormitoryService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getDormitoryInfo = catchAsync(async (req, res, next) => {
    const dormInfo = await dormitoryService.getDormitoryInfo(req.user.id);
    if (!dormInfo) {
        return next(new AppError('Kullanıcı bulunamadı', 404));
    }
    res.status(200).json(dormInfo);
});
