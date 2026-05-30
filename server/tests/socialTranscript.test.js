const express = require('express');
const request = require('supertest');

jest.mock('../services/socialTranscriptService');
const socialTranscriptService = require('../services/socialTranscriptService');
const socialTranscriptRoute = require('../routes/socialTranscript');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/social-transcript', socialTranscriptRoute);
app.use(errorHandler);

describe('Social Transcript API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the transcript', async () => {
        socialTranscriptService.get.mockResolvedValue({ requiredPoints: 100, categories: [{ id: 1, title: 'Akademik' }] });
        const res = await request(app).get('/api/social-transcript');
        expect(res.statusCode).toBe(200);
        expect(res.body.requiredPoints).toBe(100);
        expect(res.body.categories).toHaveLength(1);
    });

    it('GET returns null when there is no record', async () => {
        socialTranscriptService.get.mockResolvedValue(null);
        const res = await request(app).get('/api/social-transcript');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeNull();
    });

    it('GET returns 500 when the service fails', async () => {
        socialTranscriptService.get.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/social-transcript');
        expect(res.statusCode).toBe(500);
    });
});
