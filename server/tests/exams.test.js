const express = require('express');
const request = require('supertest');

jest.mock('../services/examService');
const examService = require('../services/examService');
const examsRoute = require('../routes/exams');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/exams', examsRoute);
app.use(errorHandler);

describe('Exams API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /results returns exam results', async () => {
        examService.listResults.mockResolvedValue([{ code: 'YZM101', exams: [{ type: 'Vize', score: 80 }] }]);
        const res = await request(app).get('/api/exams/results');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(examService.listResults).toHaveBeenCalledTimes(1);
    });

    it('GET /schedule returns the exam schedule', async () => {
        examService.listSchedule.mockResolvedValue([{ code: 'YZM101', room: 'A-101', seat: '12' }]);
        const res = await request(app).get('/api/exams/schedule');
        expect(res.statusCode).toBe(200);
        expect(res.body[0].seat).toBe('12');
    });

    it('GET /results returns an empty array when none', async () => {
        examService.listResults.mockResolvedValue([]);
        const res = await request(app).get('/api/exams/results');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});
