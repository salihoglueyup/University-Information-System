const express = require('express');
const request = require('supertest');

jest.mock('../services/thesisAssistanceService');
const thesisAssistanceService = require('../services/thesisAssistanceService');
const thesisAssistanceRoute = require('../routes/thesisAssistance');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/thesis-assistance', thesisAssistanceRoute);
app.use(errorHandler);

describe('Thesis Assistance API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists supervised students', async () => {
        thesisAssistanceService.list.mockResolvedValue([{ studentName: 'Ada', projectTitle: 'NLP', status: 'Draft Review', tasks: [] }]);
        const res = await request(app).get('/api/thesis-assistance');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].status).toBe('Draft Review');
    });

    it('GET returns 500 when the service fails', async () => {
        thesisAssistanceService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/thesis-assistance');
        expect(res.statusCode).toBe(500);
    });
});
