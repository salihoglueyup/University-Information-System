const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Log = require('../models/Log');

exports.getGeneralAnalytics = async () => {
    // 1. KPI Metrikleri
    const activeStudentsCount = await User.countDocuments({ role: 'student', status: 'active' });

    // Gelir Hesaplama (Tüm başarılı işlemlerin toplamı)
    const revenueResult = await Transaction.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const scholarshipRate = 24.5;

    // Günlük Kampüs Girişi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyLoginCount = await Log.countDocuments({ action: 'Giriş Başarılı', timestamp: { $gte: today } });

    // 2. Fakülte Bazlı Finansal Dağılım (Mock/Karma Data)
    const financeData = [
        { name: 'Mühendislik', revenue: 4500000, scholarship: 1200000 },
        { name: 'Tıp', revenue: 6800000, scholarship: 900000 },
        { name: 'Hukuk', revenue: 3200000, scholarship: 800000 },
        { name: 'Eğitim', revenue: 2100000, scholarship: 600000 },
        { name: 'MYO', revenue: 1500000, scholarship: 400000 },
    ];

    // 3. Kampüs Alan Kullanımı
    const campusUsageData = [
        { name: 'Kütüphane', value: 45 },
        { name: 'Spor Merkezi', value: 25 },
        { name: 'Yemekhane', value: 20 },
        { name: 'Laboratuvarlar', value: 10 },
    ];

    return {
        kpis: {
            totalRevenue,
            activeStudentsCount,
            scholarshipRate,
            dailyLoginCount
        },
        financeData,
        campusUsageData
    };
};

exports.getFacultyGpaDistribution = async () => {
    const Student = require('../models/Student');

    return await Student.aggregate([
        {
            $match: { gpa: { $exists: true, $nin: [null, ""] } }
        },
        {
            $addFields: { gpaNum: { $toDouble: "$gpa" } }
        },
        {
            $group: {
                _id: "$faculty",
                averageGpa: { $avg: "$gpaNum" },
                studentCount: { $sum: 1 }
            }
        },
        {
            $project: {
                faculty: "$_id",
                averageGpa: { $round: ["$averageGpa", 2] },
                studentCount: 1,
                _id: 0
            }
        },
        {
            $sort: { averageGpa: -1 }
        }
    ]);
};
