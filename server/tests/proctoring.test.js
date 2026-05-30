const express = require('express');
const request = require('supertest');

jest.mock('../services/proctoringService');
const proctoringService = require('../services/proctoringService');
const proctoringRoute = require('../routes/proctoring');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/proctoring', proctoringRoute);
app.use(errorHandler);

describe('Proctoring API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists proctoring duties', async () => {
        proctoringService.list.mockResolvedValue([{ examName: 'Vize', status: 'pending' }]);
        const res = await request(app).get('/api/proctoring');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('PATCH /:id/confirm confirms a duty (200)', async () => {
        proctoringService.confirm.mockResolvedValue({ _id: '1', status: 'confirmed', confirmedDate: '2026-05-30' });
        const res = await request(app).patch('/api/proctoring/1/confirm');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('confirmed');
        expect(proctoringService.confirm).toHaveBeenCalledWith(undefined, '1');
    });

    it('PATCH /:id/confirm returns 404 when the duty is not confirmable', async () => {
        proctoringService.confirm.mockRejectedValue(new AppError('Onaylanacak görev bulunamadı', 404));
        const res = await request(app).patch('/api/proctoring/zzz/confirm');
        expect(res.statusCode).toBe(404);
    });
});
