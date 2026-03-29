const GradeData = require('../models/GradeData');
const messageBroker = require('../utils/messageBroker');

class GradeService {
    async getGradesByUserId(userId) {
        const grades = await GradeData.findOne({ userId });
        return grades || { currentSemester: [], history: [], distribution: [] };
    }

    async saveOrUpdateGrades(userId, updates) {
        const existingData = await GradeData.findOne({ userId });

        let savedData;
        if (existingData) {
            existingData.currentSemester = updates.currentSemester || existingData.currentSemester;
            existingData.history = updates.history || existingData.history;
            existingData.distribution = updates.distribution || existingData.distribution;
            savedData = await existingData.save();
        } else {
            const newGradeData = new GradeData({ ...updates, userId });
            savedData = await newGradeData.save();
        }

        // Emit distributed event to Message Broker
        if (userId !== 'all') {
            await messageBroker.publishEvent('email_notifications', {
                userId,
                title: 'Notunuz Açıklandı',
                message: 'Ders notlarınız güncellendi. Lütfen not kartınızı kontrol ediniz.'
            });
        }

        return savedData;
    }
}

module.exports = new GradeService();
