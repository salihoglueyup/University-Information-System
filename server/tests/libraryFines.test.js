const express = require('express');
const request = require('supertest');

jest.mock('../services/libraryFineService');
const libraryFineService = require('../services/libraryFineService');
const finesRoute = require('../routes/libraryFines');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/library-fines', finesRoute);
app.use(errorHandler);

describe('Library Fines API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists fines', async () => {
        libraryFineService.list.mockResolvedValue([{ book: 'Sefiller', status: 'Ödenmedi' }]);
        const res = await request(app).get('/api/library-fines');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('PATCH /:id/pay marks a fine paid (200)', async () => {
        libraryFineService.pay.mockResolvedValue({ _id: '1', status: 'Ödendi', paidDate: '2026-05-29' });
        const res = await request(app).patch('/api/library-fines/1/pay');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('Ödendi');
        expect(libraryFineService.pay).toHaveBeenCalledWith(undefined, '1');
    });

    it('PATCH /:id/pay returns 404 when the fine is not payable', async () => {
        libraryFineService.pay.mockRejectedValue(new AppError('Ödenecek ceza bulunamadı', 404));
        const res = await request(app).patch('/api/library-fines/zzz/pay');
        expect(res.statusCode).toBe(404);
    });
});
