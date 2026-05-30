const express = require('express');
const request = require('supertest');

jest.mock('../services/tuitionFeeService');
const tuitionFeeService = require('../services/tuitionFeeService');
const tuitionFeesRoute = require('../routes/tuitionFees');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/tuition-fees', tuitionFeesRoute);
app.use(errorHandler);

describe('Tuition Fees API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists fees', async () => {
        tuitionFeeService.list.mockResolvedValue([{ term: '2025-2026 Güz', amount: '15000 ₺', status: 'Ödenmedi' }]);
        const res = await request(app).get('/api/tuition-fees');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('PATCH /:id/pay marks a fee paid (200)', async () => {
        tuitionFeeService.pay.mockResolvedValue({ _id: '1', status: 'Ödendi', receipt: true });
        const res = await request(app).patch('/api/tuition-fees/1/pay');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('Ödendi');
        expect(tuitionFeeService.pay).toHaveBeenCalledWith(undefined, '1');
    });

    it('PATCH /:id/pay returns 404 when the fee is not payable', async () => {
        tuitionFeeService.pay.mockRejectedValue(new AppError('Ödenecek harç bulunamadı', 404));
        const res = await request(app).patch('/api/tuition-fees/zzz/pay');
        expect(res.statusCode).toBe(404);
    });
});
