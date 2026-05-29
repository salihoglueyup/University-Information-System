const SupportTicket = require('../models/SupportTicket');
const AppError = require('../utils/AppError');

const VALID_CATEGORIES = ['Öğrenci İşleri', 'Bilgi İşlem (Teknik)', 'Mali İşler', 'Kütüphane', 'Diğer'];

exports.list = async (username) => {
    return SupportTicket.find({ userId: username }).sort({ createdAt: -1 }).limit(100).lean();
};

exports.create = async (username, data) => {
    const { subject, category, message } = data || {};
    if (!subject || !String(subject).trim()) {
        throw new AppError('Konu gereklidir', 400);
    }
    if (!message || !String(message).trim()) {
        throw new AppError('Mesaj gereklidir', 400);
    }
    return SupportTicket.create({
        userId: username,
        subject: String(subject).trim(),
        category: VALID_CATEGORIES.includes(category) ? category : 'Diğer',
        message: String(message).trim()
    });
};
