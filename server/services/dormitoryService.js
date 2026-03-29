const Dormitory = require('../models/Dormitory');
const User = require('../models/User');

exports.getDormitoryInfo = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return null;

    let dormData = await Dormitory.findOne({ studentNo: user.username });

    if (!dormData) {
        dormData = new Dormitory({
            studentNo: user.username,
            info: {
                room: "Blok B - Oda 305",
                type: "3 Kişilik",
                bed: "Yatak 2",
                friends: ["Ali Vural", "Mehmet Demir"]
            },
            paymentStatus: {
                lastPaymentBase: "2026-02-01",
                status: "Ödendi",
                amount: "5.000 ₺",
                nextPayment: "2026-03-01"
            },
            permissions: [
                { date: "2026-01-20", type: "Hafta Sonu", status: "Onaylandı" },
                { date: "2026-02-14", type: "Çarşı", status: "Bekliyor" }
            ]
        });
        await dormData.save();
    }

    return dormData;
};
