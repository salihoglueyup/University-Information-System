const express = require('express');
const request = require('supertest');

// Mock services so routes can be tested without a database.
jest.mock('../services/lostFoundService');
jest.mock('../services/leaveService');
jest.mock('../services/supportService');
jest.mock('../services/scholarshipService');

const lostFoundService = require('../services/lostFoundService');
const leaveService = require('../services/leaveService');
const supportService = require('../services/supportService');
const scholarshipService = require('../services/scholarshipService');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/lost-found', require('../routes/lostfound'));
app.use('/api/leave', require('../routes/leave'));
app.use('/api/support', require('../routes/support'));
app.use('/api/scholarships', require('../routes/scholarships'));
app.use(errorHandler);

describe('Student module routes — validation + wiring', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('Lost & Found', () => {
        it('GET lists items', async () => {
            lostFoundService.list.mockResolvedValue([{ item: 'Cüzdan' }]);
            const res = await request(app).get('/api/lost-found');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        });
        it('POST with a valid item creates (201)', async () => {
            lostFoundService.create.mockResolvedValue({ _id: '1', item: 'Cüzdan' });
            const res = await request(app).post('/api/lost-found').send({ item: 'Cüzdan', type: 'lost' });
            expect(res.statusCode).toBe(201);
            expect(lostFoundService.create).toHaveBeenCalledTimes(1);
        });
        it('POST without item is rejected (400)', async () => {
            const res = await request(app).post('/api/lost-found').send({ type: 'lost' });
            expect(res.statusCode).toBe(400);
            expect(lostFoundService.create).not.toHaveBeenCalled();
        });
        it('POST with an invalid type is rejected (400)', async () => {
            const res = await request(app).post('/api/lost-found').send({ item: 'Cüzdan', type: 'bogus' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('Leave', () => {
        it('POST with a valid date range creates (201)', async () => {
            leaveService.create.mockResolvedValue({ _id: '1' });
            const res = await request(app).post('/api/leave').send({ startDate: '2026-06-01', endDate: '2026-06-03' });
            expect(res.statusCode).toBe(201);
        });
        it('POST without dates is rejected (400)', async () => {
            const res = await request(app).post('/api/leave').send({ type: 'Rapor' });
            expect(res.statusCode).toBe(400);
            expect(leaveService.create).not.toHaveBeenCalled();
        });
    });

    describe('Support', () => {
        it('POST with subject + message creates (201)', async () => {
            supportService.create.mockResolvedValue({ _id: '1' });
            const res = await request(app).post('/api/support').send({ subject: 'Konu', message: 'Mesaj detayı' });
            expect(res.statusCode).toBe(201);
        });
        it('POST without message is rejected (400)', async () => {
            const res = await request(app).post('/api/support').send({ subject: 'Konu' });
            expect(res.statusCode).toBe(400);
            expect(supportService.create).not.toHaveBeenCalled();
        });
    });

    describe('Scholarships', () => {
        it('GET lists', async () => {
            scholarshipService.list.mockResolvedValue([]);
            const res = await request(app).get('/api/scholarships');
            expect(res.statusCode).toBe(200);
        });
        it('POST apply with a name creates (201)', async () => {
            scholarshipService.apply.mockResolvedValue({ _id: '1' });
            const res = await request(app).post('/api/scholarships').send({ name: 'KYK Bursu' });
            expect(res.statusCode).toBe(201);
        });
        it('POST apply without a name is rejected (400)', async () => {
            const res = await request(app).post('/api/scholarships').send({ type: 'KYK' });
            expect(res.statusCode).toBe(400);
            expect(scholarshipService.apply).not.toHaveBeenCalled();
        });
    });
});
