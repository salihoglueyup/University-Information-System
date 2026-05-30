const express = require('express');
const request = require('supertest');

jest.mock('../services/shuttleService');
const shuttleService = require('../services/shuttleService');
const shuttleRoute = require('../routes/shuttle');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/shuttle', shuttleRoute);
app.use(errorHandler);

describe('Shuttle API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists shuttle routes', async () => {
        shuttleService.list.mockResolvedValue([{ route: 'Kampüs - Metro', times: ['08:00', '09:00'] }]);
        const res = await request(app).get('/api/shuttle');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].times).toEqual(['08:00', '09:00']);
    });

    it('GET returns 500 when the service fails', async () => {
        shuttleService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/shuttle');
        expect(res.statusCode).toBe(500);
    });
});
