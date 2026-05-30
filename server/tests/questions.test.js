const express = require('express');
const request = require('supertest');

jest.mock('../services/questionService');
const questionService = require('../services/questionService');
const questionsRoute = require('../routes/questions');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/questions', questionsRoute);
app.use(errorHandler);

describe('Question Bank API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists questions', async () => {
        questionService.list.mockResolvedValue([{ text: '2+2=?', difficulty: 'Kolay' }]);
        const res = await request(app).get('/api/questions');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST with a valid question creates (201)', async () => {
        questionService.create.mockResolvedValue({ _id: '1', text: 'Soru' });
        const res = await request(app).post('/api/questions')
            .send({ text: 'Diziler nedir?', course: 'BIL101', topic: 'Diziler', difficulty: 'Orta', type: 'Klasik' });
        expect(res.statusCode).toBe(201);
        expect(questionService.create).toHaveBeenCalledTimes(1);
    });

    it('POST without text is rejected (400)', async () => {
        const res = await request(app).post('/api/questions').send({ topic: 'Diziler' });
        expect(res.statusCode).toBe(400);
        expect(questionService.create).not.toHaveBeenCalled();
    });

    it('POST with an invalid difficulty is rejected (400)', async () => {
        const res = await request(app).post('/api/questions').send({ text: 'Soru', difficulty: 'İmkansız' });
        expect(res.statusCode).toBe(400);
    });

    it('DELETE /:id removes a question (204)', async () => {
        questionService.remove.mockResolvedValue({ _id: '1' });
        const res = await request(app).delete('/api/questions/1');
        expect(res.statusCode).toBe(204);
        expect(questionService.remove).toHaveBeenCalledWith(undefined, '1');
    });

    it('DELETE /:id returns 404 when missing', async () => {
        questionService.remove.mockRejectedValue(new AppError('Soru bulunamadı', 404));
        const res = await request(app).delete('/api/questions/zzz');
        expect(res.statusCode).toBe(404);
    });
});
