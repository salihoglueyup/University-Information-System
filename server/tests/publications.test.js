const express = require('express');
const request = require('supertest');

jest.mock('../services/publicationService');
const publicationService = require('../services/publicationService');
const publicationsRoute = require('../routes/publications');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/publications', publicationsRoute);
app.use(errorHandler);

describe('Publications API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists publications', async () => {
        publicationService.list.mockResolvedValue([{ title: 'Derin Öğrenme', type: 'SCI Makale', year: 2025, points: 20 }]);
        const res = await request(app).get('/api/publications');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].points).toBe(20);
    });

    it('GET returns 500 when the service fails', async () => {
        publicationService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/publications');
        expect(res.statusCode).toBe(500);
    });
});
