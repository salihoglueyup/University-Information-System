const announcementService = require('../services/announcementService');

class AnnouncementController {
    async getAll(req, res, next) {
        try {
            const announcements = await announcementService.getAllAnnouncements();
            res.status(200).json(announcements);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const io = req.app.get('io');
            const result = await announcementService.createAnnouncement(req.body, io);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AnnouncementController();
