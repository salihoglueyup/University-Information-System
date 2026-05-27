const paymentService = require('../services/paymentService');
const catchAsync = require('../utils/catchAsync');

exports.getPaymentOverview = catchAsync(async (req, res, next) => {
    const data = await paymentService.getPaymentOverview(req.user.id);
    res.status(200).json(data);
});

exports.payTuition = catchAsync(async (req, res, next) => {
    const tuition = await paymentService.payTuition(req.user.id, req.body.installmentId);
    res.status(200).json({ message: "Ödeme başarıyla alındı", tuition });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
    const transaction = await paymentService.createTransaction(req.user.id, req.body);
    res.status(201).json({ message: "İşlem eklendi", transaction });
});

exports.getMonthlyFinanceStats = catchAsync(async (req, res) => {
    const stats = await paymentService.getMonthlyFinanceStats();
    res.status(200).json(stats);
});
