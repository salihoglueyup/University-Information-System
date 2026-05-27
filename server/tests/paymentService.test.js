const paymentService = require('../services/paymentService');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Tuition = require('../models/Tuition');

jest.mock('../models/User');
jest.mock('../models/Transaction');
jest.mock('../models/Tuition');

describe('PaymentService', () => {
    afterEach(() => jest.clearAllMocks());

    describe('getPaymentOverview', () => {
        it('should throw when user does not exist', async () => {
            User.findById.mockResolvedValue(null);
            await expect(paymentService.getPaymentOverview('bad-id')).rejects.toThrow('Kullanıcı bulunamadı');
        });

        it('should return payment overview for valid user', async () => {
            User.findById.mockResolvedValue({ _id: 'u1', username: 'student1' });

            const mockSort = jest.fn().mockResolvedValue([{ title: 'Test', amount: 100 }]);
            Transaction.find.mockReturnValue({ sort: mockSort });
            Tuition.findOne.mockResolvedValue({ userId: 'student1', totalAmount: 140000 });

            const result = await paymentService.getPaymentOverview('u1');
            expect(result.transactions).toBeDefined();
            expect(result.tuition).toBeDefined();
            expect(result.spendingData).toBeDefined();
            expect(result.cards).toBeDefined();
        });
    });

    describe('payTuition', () => {
        it('should throw for invalid user', async () => {
            User.findById.mockResolvedValue(null);
            await expect(paymentService.payTuition('bad-id', 'inst1')).rejects.toThrow('Kullanıcı bulunamadı');
        });

        it('should throw when no tuition record', async () => {
            User.findById.mockResolvedValue({ _id: 'u1', username: 'student1' });
            Tuition.findOneAndUpdate.mockResolvedValue(null);
            Tuition.findOne.mockResolvedValue(null);
            await expect(paymentService.payTuition('u1', 'inst1')).rejects.toThrow('Harç bilgisi bulunamadı');
        });

        it('should throw for already paid installment', async () => {
            User.findById.mockResolvedValue({ _id: 'u1', username: 'student1' });
            Tuition.findOneAndUpdate.mockResolvedValue(null);
            Tuition.findOne.mockResolvedValue({ userId: 'student1' }); // tuition exists but installment was paid
            await expect(paymentService.payTuition('u1', 'inst1')).rejects.toThrow('Geçersiz veya ödenmiş taksit');
        });

        it('should mark installment as paid', async () => {
            const mockInstallment = { status: 'Ödenmedi', amount: 75000, method: '-' };
            const oldTuition = {
                _id: 't1',
                userId: 'student1',
                paidAmount: 65000,
                installments: { id: jest.fn().mockReturnValue(mockInstallment) }
            };
            const updatedTuition = {
                _id: 't1',
                userId: 'student1',
                paidAmount: 140000,
                installments: [{ status: 'Ödendi', amount: 75000, method: 'Sanal Pos' }]
            };

            User.findById.mockResolvedValue({ _id: 'u1', username: 'student1' });
            Tuition.findOneAndUpdate.mockResolvedValue(oldTuition);
            Tuition.updateOne.mockResolvedValue({ modifiedCount: 1 });
            Tuition.findById.mockResolvedValue(updatedTuition);

            const result = await paymentService.payTuition('u1', 'inst1');
            expect(Tuition.findOneAndUpdate).toHaveBeenCalled();
            expect(Tuition.updateOne).toHaveBeenCalledWith(
                { _id: 't1' },
                { $inc: { paidAmount: 75000 } }
            );
            expect(result.paidAmount).toBe(140000);
        });
    });

    describe('createTransaction', () => {
        it('should throw for invalid user', async () => {
            User.findById.mockResolvedValue(null);
            await expect(paymentService.createTransaction('bad-id', { amount: 100 })).rejects.toThrow('Kullanıcı bulunamadı');
        });

        it('should create and save a new transaction', async () => {
            User.findById.mockResolvedValue({ _id: 'u1', username: 'student1' });

            const mockSave = jest.fn().mockResolvedValue({
                userId: 'student1', title: 'Test', amount: 50, type: 'expense', category: 'Yemek'
            });
            Transaction.mockImplementation(() => ({ save: mockSave }));

            const result = await paymentService.createTransaction('u1', {
                title: 'Test', amount: '50', type: 'expense', category: 'Yemek'
            });
            expect(mockSave).toHaveBeenCalled();
        });
    });

    describe('getMonthlyFinanceStats', () => {
        it('should return aggregated income by month', async () => {
            const mockData = [{ month: 1, totalIncome: 5000 }, { month: 2, totalIncome: 8000 }];
            Transaction.aggregate.mockResolvedValue(mockData);

            const result = await paymentService.getMonthlyFinanceStats();
            expect(result).toEqual(mockData);
            expect(Transaction.aggregate).toHaveBeenCalled();
        });
    });
});
