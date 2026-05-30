const express = require('express');
const request = require('supertest');

jest.mock('../services/partTimeWorkService');
const partTimeWorkService = require('../services/partTimeWorkService');
const partTimeWorkRoute = require('../routes/partTimeWork');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/part-time-work', partTimeWorkRoute);
app.use(errorHandler);

describe('Part-Time Work API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the assignment', async () => {
        partTimeWorkService.get.mockResolvedValue({ role: 'Asistan', workedThisMonth: '8 saat' });
        const res = await request(app).get('/api/part-time-work');
        expect(res.statusCode).toBe(200);
        expect(res.body.role).toBe('Asistan');
    });

    it('POST /shifts logs a shift (201)', async () => {
        partTimeWorkService.addShift.mockResolvedValue({ workedThisMonth: '12 saat', shifts: [{ date: '2026-05-30', total: 4 }] });
        const res = await request(app).post('/api/part-time-work/shifts').send({ date: '2026-05-30', hours: '09:00-13:00', total: 4 });
        expect(res.statusCode).toBe(201);
        expect(res.body.workedThisMonth).toBe('12 saat');
        expect(partTimeWorkService.addShift).toHaveBeenCalledWith(undefined, { date: '2026-05-30', hours: '09:00-13:00', total: 4 });
    });

    it('POST /shifts rejects a missing date (400)', async () => {
        const res = await request(app).post('/api/part-time-work/shifts').send({ total: 4 });
        expect(res.statusCode).toBe(400);
        expect(partTimeWorkService.addShift).not.toHaveBeenCalled();
    });

    it('POST /shifts returns 404 when there is no assignment', async () => {
        partTimeWorkService.addShift.mockRejectedValue(new AppError('Kısmi zamanlı çalışma kaydınız bulunamadı', 404));
        const res = await request(app).post('/api/part-time-work/shifts').send({ date: '2026-05-30', total: 4 });
        expect(res.statusCode).toBe(404);
    });
});
