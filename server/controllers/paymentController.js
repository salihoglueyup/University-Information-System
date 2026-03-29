const paymentService = require('../services/paymentService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getPaymentOverview = catchAsync(async (req, res, next) => {
    try {
        const data = await paymentService.getPaymentOverview(req.userId); // auth middleware sets req.userId
        res.status(200).json(data);
    } catch (err) {
        if (err.message === 'USER_NOT_FOUND') return next(new AppError('Kullanıcı bulunamadı', 404));
        return next(new AppError('Sunucu hatası', 500));
    }
});

exports.payTuition = catchAsync(async (req, res, next) => {
    try {
        const tuition = await paymentService.payTuition(req.userId, req.body.installmentId);
        res.status(200).json({ message: "Ödeme başarıyla alındı", tuition });
    } catch (err) {
        if (err.message === 'USER_NOT_FOUND') return next(new AppError('Kullanıcı bulunamadı', 404));
        if (err.message === 'TUITION_NOT_FOUND') return next(new AppError('Harç bilgisi bulunamadı', 404));
        if (err.message === 'INVALID_INSTALLMENT') return next(new AppError('Geçersiz veya ödenmiş taksit', 400));
        return next(new AppError('Sunucu hatası', 500));
    }
});

exports.createTransaction = catchAsync(async (req, res, next) => {
    try {
        const transaction = await paymentService.createTransaction(req.userId, req.body);
        res.status(201).json({ message: "İşlem eklendi", transaction });
    } catch (err) {
        if (err.message === 'USER_NOT_FOUND') return next(new AppError('Kullanıcı bulunamadı', 404));
        return next(new AppError('Sunucu hatası', 500));
    }
});

exports.getMonthlyFinanceStats = catchAsync(async (req, res) => {
    const stats = await paymentService.getMonthlyFinanceStats();
    res.status(200).json(stats);
});
