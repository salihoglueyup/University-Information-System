const express = require('express');
const request = require('supertest');

jest.mock('../services/virtualTourService');
const virtualTourService = require('../services/virtualTourService');
const virtualTourRoute = require('../routes/virtualTour');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/virtual-tour', virtualTourRoute);
app.use(errorHandler);

describe('Virtual Tour API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists tour spots', async () => {
        virtualTourService.list.mockResolvedValue([{ title: 'Merkez Kampüs', url: 'http://x/1.jpg' }]);
        const res = await request(app).get('/api/virtual-tour');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Merkez Kampüs');
    });

    it('GET returns 500 when the service fails', async () => {
        virtualTourService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/virtual-tour');
        expect(res.statusCode).toBe(500);
    });
});
