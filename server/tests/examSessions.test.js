const express = require('express');
const request = require('supertest');

jest.mock('../services/examSessionService');
const examSessionService = require('../services/examSessionService');
const examSessionsRoute = require('../routes/examSessions');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/exam-sessions', examSessionsRoute);
app.use(errorHandler);

describe('Exam Sessions API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists exam sessions', async () => {
        examSessionService.list.mockResolvedValue([{ courseName: 'Algoritma', courseCode: 'BIL201', status: 'Planlandı', proctors: ['Dr. Ada'] }]);
        const res = await request(app).get('/api/exam-sessions');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].status).toBe('Planlandı');
    });

    it('GET returns 500 when the service fails', async () => {
        examSessionService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/exam-sessions');
        expect(res.statusCode).toBe(500);
    });
});
