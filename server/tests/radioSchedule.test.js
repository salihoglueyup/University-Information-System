const express = require('express');
const request = require('supertest');

jest.mock('../services/radioScheduleService');
const radioScheduleService = require('../services/radioScheduleService');
const radioScheduleRoute = require('../routes/radioSchedule');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/radio-schedule', radioScheduleRoute);
app.use(errorHandler);

describe('Radio Schedule API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists the broadcast schedule', async () => {
        radioScheduleService.list.mockResolvedValue([{ time: '10:00', program: 'Kampüsün Sesi', host: 'Ali' }]);
        const res = await request(app).get('/api/radio-schedule');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].program).toBe('Kampüsün Sesi');
    });

    it('GET returns 500 when the service fails', async () => {
        radioScheduleService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/radio-schedule');
        expect(res.statusCode).toBe(500);
    });
});
