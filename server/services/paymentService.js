const Transaction = require('../models/Transaction');
const Tuition = require('../models/Tuition');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getPaymentOverview = async (userIdStr) => {
    const user = await User.findById(userIdStr);
    if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

    const transactions = await Transaction.find({ userId: user.username }).sort({ date: -1 });
    const tuition = await Tuition.findOne({ userId: user.username });

    return {
        transactions,
        tuition,
        spendingData: [
            { category: "Yemek", amount: 450, color: "bg-orange-500" },
            { category: "Ulaşım", amount: 200, color: "bg-blue-500" },
            { category: "Market", amount: 150, color: "bg-green-500" },
            { category: "Diğer", amount: 100, color: "bg-slate-400" }
        ],
        cards: [
            { id: 1, bank: "Vakıfbank", type: "Kampüs Kart", number: "4000 **** **** 1234", balance: "250.00 ₺", expiry: "12/28", holder: "TEST USER", theme: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
            { id: 2, bank: "Ziraat Bankası", type: "Genç Kart", number: "5000 **** **** 5678", balance: "1.250.00 ₺", expiry: "09/27", holder: "TEST USER", theme: "bg-gradient-to-r from-red-600 to-red-800" }
        ]
    };
};

exports.payTuition = async (userIdStr, installmentId) => {
    const user = await User.findById(userIdStr);
    if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

    // Atomic update: only update if installment is still unpaid
    const tuition = await Tuition.findOneAndUpdate(
        {
            userId: user.username,
            'installments._id': installmentId,
            'installments.status': 'Ödenmedi'
        },
        {
            $set: {
                'installments.$.status': 'Ödendi',
                'installments.$.method': 'Sanal Pos'
            },
            $inc: { paidAmount: 0 } // placeholder, will calculate below
        },
        { new: false } // return old doc to get the amount
    );

    if (!tuition) {
        // Distinguish: no tuition record vs already-paid installment
        const exists = await Tuition.findOne({ userId: user.username });
        if (!exists) {
            throw new AppError('Harç bilgisi bulunamadı', 404);
        }
        throw new AppError('Geçersiz veya ödenmiş taksit', 400);
    }

    // Get the installment amount and do the actual paidAmount increment atomically
    const inst = tuition.installments.id(installmentId);
    await Tuition.updateOne(
        { _id: tuition._id },
        { $inc: { paidAmount: inst.amount } }
    );

    const updatedTuition = await Tuition.findById(tuition._id);
    return updatedTuition;
};

exports.createTransaction = async (userIdStr, transData) => {
    const { title, amount, type, category } = transData;
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || Math.abs(parsedAmount) > 1_000_000) {
        throw new AppError('Geçersiz tutar', 400);
    }
    const user = await User.findById(userIdStr);
    if (!user) throw new AppError('Kullanıcı bulunamadı', 404);

    const newTrans = new Transaction({
        userId: user.username,
        title,
        amount: parsedAmount,
        type,
        category
    });

    return await newTrans.save();
};

exports.getMonthlyFinanceStats = async () => {
    // Pipeline for Transaction revenues grouped by Month
    return await Transaction.aggregate([
        {
            $match: { type: 'income', date: { $exists: true } }
        },
        {
            $group: {
                _id: { $month: "$date" },
                totalIncome: { $sum: "$amount" }
            }
        },
        {
            $project: {
                month: "$_id",
                totalIncome: 1,
                _id: 0
            }
        },
        {
            $sort: { month: 1 }
        }
    ]);
};
