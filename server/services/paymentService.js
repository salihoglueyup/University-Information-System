const Transaction = require('../models/Transaction');
const Tuition = require('../models/Tuition');
const User = require('../models/User');

exports.getPaymentOverview = async (userIdStr) => {
    const user = await User.findById(userIdStr);
    if (!user) throw new Error('USER_NOT_FOUND');

    let transactions = await Transaction.find({ userId: user.username }).sort({ date: -1 });
    let tuition = await Tuition.findOne({ userId: user.username });

    if (transactions.length === 0) {
        const dummyTransactions = [
            { userId: user.username, title: "Yemekhane", amount: -45, type: 'expense', category: "Yemek" },
            { userId: user.username, title: "Kantın Harcaması", amount: -25, type: 'expense', category: "Yiyecek" },
            { userId: user.username, title: "Kütüphane Cezası", amount: -15, type: 'expense', category: "Ceza" },
            { userId: user.username, title: "Para Yükleme", amount: 500, type: 'income', category: "Transfer" }
        ];
        await Transaction.insertMany(dummyTransactions);
        transactions = await Transaction.find({ userId: user.username }).sort({ date: -1 });
    }

    if (!tuition) {
        tuition = await Tuition.create({
            userId: user.username,
            totalAmount: 140000,
            scholarship: "%50 İndirim + %5 Peşin",
            paidAmount: 65000,
            installments: [
                { term: "2025-2026 Güz", amount: 65000, status: "Ödendi", date: new Date("2025-09-01"), method: "Kredi Kartı", receipt: "dekont_123.pdf" },
                { term: "2025-2026 Bahar", amount: 75000, status: "Ödenmedi", date: new Date("2026-02-28"), method: "-" }
            ]
        });
    }

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
    if (!user) throw new Error('USER_NOT_FOUND');

    const tuition = await Tuition.findOne({ userId: user.username });
    if (!tuition) throw new Error('TUITION_NOT_FOUND');

    const inst = tuition.installments.id(installmentId);
    if (!inst || inst.status === 'Ödendi') {
        throw new Error('INVALID_INSTALLMENT');
    }

    inst.status = 'Ödendi';
    inst.method = 'Sanal Pos';
    tuition.paidAmount += inst.amount;

    await tuition.save();
    return tuition;
};

exports.createTransaction = async (userIdStr, transData) => {
    const { title, amount, type, category } = transData;
    const user = await User.findById(userIdStr);
    if (!user) throw new Error('USER_NOT_FOUND');

    const newTrans = new Transaction({
        userId: user.username,
        title,
        amount: Number(amount),
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
