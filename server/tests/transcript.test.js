const express = require('express');
const request = require('supertest');

jest.mock('../services/transcriptService');
const transcriptService = require('../services/transcriptService');
const transcriptRoute = require('../routes/transcript');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/transcript', transcriptRoute);
app.use(errorHandler);

describe('Transcript API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists transcript rows', async () => {
        transcriptService.list.mockResolvedValue([{ code: 'BIL101', name: 'Programlama', letter: 'AA', credit: 4 }]);
        const res = await request(app).get('/api/transcript');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].letter).toBe('AA');
    });

    it('GET returns 500 when the service fails', async () => {
        transcriptService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/transcript');
        expect(res.statusCode).toBe(500);
    });
});
