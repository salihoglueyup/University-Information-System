const express = require('express');
const request = require('supertest');

jest.mock('../services/graduationStatusService');
const graduationStatusService = require('../services/graduationStatusService');
const graduationStatusRoute = require('../routes/graduationStatus');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/graduation-status', graduationStatusRoute);
app.use(errorHandler);

describe('Graduation Status API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the status', async () => {
        graduationStatusService.get.mockResolvedValue({ totalCredits: 210, requiredCredits: 240, gpa: 3.1 });
        const res = await request(app).get('/api/graduation-status');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalCredits).toBe(210);
    });

    it('GET returns null when there is no record', async () => {
        graduationStatusService.get.mockResolvedValue(null);
        const res = await request(app).get('/api/graduation-status');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeNull();
    });

    it('GET returns 500 when the service fails', async () => {
        graduationStatusService.get.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/graduation-status');
        expect(res.statusCode).toBe(500);
    });
});
