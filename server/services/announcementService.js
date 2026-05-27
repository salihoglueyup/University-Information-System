const Announcement = require('../models/Announcement');
const logger = require('../utils/logger');

class AnnouncementService {
    async getAllAnnouncements() {
        return await Announcement.find()
            .read('secondaryPreferred')
            .sort({ date: -1 });
    }

    async createAnnouncement(data) {
        const newAnnouncement = new Announcement(data);
        const savedAnnouncement = await newAnnouncement.save();

        const socketAPI = require('../socket');
        try {
            const io = socketAPI.getIO();
            io.emit('new_notification', {
                title: 'Yeni Duyuru: ' + savedAnnouncement.title,
                message: savedAnnouncement.text.substring(0, 50) + '...',
                type: 'announcement',
                timestamp: new Date()
            });
        } catch (error) {
            logger.warn("Socket emit failed:", error.message);
        }

        return savedAnnouncement;
    }
}

module.exports = new AnnouncementService();
