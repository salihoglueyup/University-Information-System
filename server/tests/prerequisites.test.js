const express = require('express');
const request = require('supertest');

jest.mock('../services/prerequisiteService');
const prerequisiteService = require('../services/prerequisiteService');
const prerequisitesRoute = require('../routes/prerequisites');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/prerequisites', prerequisitesRoute);
app.use(errorHandler);

describe('Prerequisites API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists prerequisites', async () => {
        prerequisiteService.list.mockResolvedValue([{ code: 'BIL201', name: 'Veri Yapıları', prerequisites: ['BIL101'] }]);
        const res = await request(app).get('/api/prerequisites');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].prerequisites).toEqual(['BIL101']);
    });

    it('GET returns 500 when the service fails', async () => {
        prerequisiteService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/prerequisites');
        expect(res.statusCode).toBe(500);
    });
});
