const Schedule = require('../models/Schedule');
const User = require('../models/User');
const AppError = require('../utils/AppError');

class ScheduleService {
    async getAllSchedules(userId) {
        const user = await User.findById(userId);
        if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

        const schedules = await Schedule.find({ userId: { $in: [userId, 'all'] } });
        return schedules;
    }

    async createSchedule(data) {
        const newSchedule = new Schedule(data);
        return await newSchedule.save();
    }
}

module.exports = new ScheduleService();
