const express = require('express');
const request = require('supertest');

jest.mock('../services/infoResourceService');
const infoResourceService = require('../services/infoResourceService');
const infoResourcesRoute = require('../routes/infoResources');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/info-resources', infoResourcesRoute);
app.use(errorHandler);

describe('Info Resources API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists resources', async () => {
        infoResourceService.list.mockResolvedValue([{ name: 'IEEE Xplore', type: 'Veritabanı' }]);
        const res = await request(app).get('/api/info-resources');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe('IEEE Xplore');
    });

    it('GET returns 500 when the service fails', async () => {
        infoResourceService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/info-resources');
        expect(res.statusCode).toBe(500);
    });
});
