const Schedule = require('../models/Schedule');
const User = require('../models/User');

class ScheduleService {
    async getAllSchedules(userId) {
        // Technically req.user is verified in auth middleware before getting here
        const user = await User.findById(userId);
        if (!user) throw { status: 404, message: "Kullanıcı bulunamadı" };

        let schedules = await Schedule.find({ userId: 'all' });

        // Seed dummy schedule data if empty
        if (schedules.length === 0) {
            const dummySchedules = [
                { userId: "all", day: "Pazartesi", start: "09:00", end: "12:00", course: "Yazılım Mimarisi (Grup A)", room: "D-201", type: "Ders", instructor: "Prof. Dr. Ahmet Yılmaz" },
                { userId: "all", day: "Pazartesi", start: "13:00", end: "16:00", course: "Yazılım Mimarisi (Grup B)", room: "D-201", type: "Ders", instructor: "Prof. Dr. Ahmet Yılmaz" },
                { userId: "all", day: "Salı", start: "09:00", end: "12:00", course: "Web Programlama (Grup A)", room: "Lab-3", type: "Lab", instructor: "Dr. Ayşe Kaya" },
                { userId: "all", day: "Salı", start: "13:00", end: "16:00", course: "Web Programlama (Grup B)", room: "Lab-3", type: "Lab", instructor: "Dr. Ayşe Kaya" },
                { userId: "all", day: "Çarşamba", start: "10:00", end: "13:00", course: "Yapay Zeka", room: "Lab-1", type: "Lab", instructor: "Doç. Dr. Mehmet Demir" },
                { userId: "all", day: "Cuma", start: "09:00", end: "12:00", course: "Bitirme Projesi I", room: "Toplantı Salonu", type: "Ders", instructor: "Heyet" }
            ];
            await Schedule.insertMany(dummySchedules);
            schedules = await Schedule.find({ userId: 'all' });
        }

        return schedules;
    }

    async createSchedule(data) {
        const newSchedule = new Schedule(data);
        return await newSchedule.save();
    }
}

module.exports = new ScheduleService();
