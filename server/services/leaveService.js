const LeaveRequest = require('../models/LeaveRequest');
const AppError = require('../utils/AppError');

const VALID_TYPES = ['Yıllık İzin', 'Rapor', 'Görevlendirme', 'Mazeret'];

function computeDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
    return Math.round((end - start) / 86400000) + 1;
}

exports.list = async (username) => {
    return LeaveRequest.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

exports.create = async (username, data) => {
    const { type, reason, startDate, endDate } = data || {};
    if (!startDate || !endDate) {
        throw new AppError('Başlangıç ve bitiş tarihi gereklidir', 400);
    }
    const days = computeDays(startDate, endDate);
    if (days <= 0) {
        throw new AppError('Geçersiz tarih aralığı (bitiş, başlangıçtan önce olamaz)', 400);
    }
    return LeaveRequest.create({
        userId: username,
        type: VALID_TYPES.includes(type) ? type : 'Yıllık İzin',
        reason: reason || '',
        startDate,
        endDate,
        days
    });
};
