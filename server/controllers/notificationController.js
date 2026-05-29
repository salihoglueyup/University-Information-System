const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

const recipientKeys = (user) =>
    [user && user.username, user && user.id, user && user._id]
        .filter(Boolean)
        .map(String);

class NotificationController {
    async list(req, res, next) {
        try {
            const items = await Notification.find({ recipient: { $in: recipientKeys(req.user) } })
                .sort({ createdAt: -1 })
                .limit(50);
            res.status(200).json(items);
        } catch (err) {
            next(err);
        }
    }

    async markRead(req, res, next) {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: req.params.id, recipient: { $in: recipientKeys(req.user) } },
                { read: true },
                { new: true }
            );
            if (!notification) return next(new AppError('Bildirim bulunamadı', 404));
            res.status(200).json(notification);
        } catch (err) {
            next(err);
        }
    }

    async markAllRead(req, res, next) {
        try {
            await Notification.updateMany(
                { recipient: { $in: recipientKeys(req.user) }, read: false },
                { read: true }
            );
            res.status(200).json({ message: 'Tüm bildirimler okundu olarak işaretlendi' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new NotificationController();
