const express = require('express');
const request = require('supertest');

jest.mock('../services/syllabusService');
const syllabusService = require('../services/syllabusService');
const syllabusRoute = require('../routes/syllabus');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/syllabus', syllabusRoute);
app.use(errorHandler);

describe('Syllabus API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists weeks for a course', async () => {
        syllabusService.list.mockResolvedValue([{ week: 1, topic: 'Giriş', resources: 'Slaytlar' }]);
        const res = await request(app).get('/api/syllabus?courseId=abc');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(syllabusService.list).toHaveBeenCalledWith('abc');
    });

    it('GET without a courseId returns an empty list', async () => {
        syllabusService.list.mockResolvedValue([]);
        const res = await request(app).get('/api/syllabus');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
        expect(syllabusService.list).toHaveBeenCalledWith(undefined);
    });

    it('GET returns 500 when the service fails', async () => {
        syllabusService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/syllabus?courseId=abc');
        expect(res.statusCode).toBe(500);
    });
});
