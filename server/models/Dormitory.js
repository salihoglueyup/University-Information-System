const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    date: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Bekliyor', 'Onaylandı', 'Reddedildi'], default: 'Bekliyor' }
});

const DormitorySchema = new mongoose.Schema({
    studentNo: {
        type: String, // E.g. "B211200051" mapping to Student
        required: true,
        unique: true
    },
    info: {
        room: { type: String, default: "Bilinmiyor" },
        type: { type: String, default: "Bilinmiyor" },
        bed: { type: String, default: "-" },
        friends: [{ type: String }]
    },
    paymentStatus: {
        lastPaymentBase: { type: String },
        status: { type: String, default: "Ödenmedi" },
        amount: { type: String, default: "0 ₺" },
        nextPayment: { type: String }
    },
    permissions: [PermissionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Dormitory', DormitorySchema);
