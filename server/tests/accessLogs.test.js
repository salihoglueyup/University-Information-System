const express = require('express');
const request = require('supertest');

jest.mock('../services/accessLogService');
const accessLogService = require('../services/accessLogService');
const accessLogsRoute = require('../routes/accessLogs');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/access-logs', accessLogsRoute);
app.use(errorHandler);

describe('Access Logs API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists access logs', async () => {
        accessLogService.list.mockResolvedValue([{ location: 'A Blok', type: 'Giriş', time: '08:30' }]);
        const res = await request(app).get('/api/access-logs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].type).toBe('Giriş');
    });

    it('GET returns 500 when the service fails', async () => {
        accessLogService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/access-logs');
        expect(res.statusCode).toBe(500);
    });
});
