const express = require('express');
const request = require('supertest');

jest.mock('../services/electronicExamService');
const electronicExamService = require('../services/electronicExamService');
const electronicExamsRoute = require('../routes/electronicExams');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/electronic-exams', electronicExamsRoute);
app.use(errorHandler);

describe('Electronic Exams API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists e-exam appointments', async () => {
        electronicExamService.list.mockResolvedValue([{ course: 'İngilizce', status: 'Randevu Alındı', center: 'Merkez' }]);
        const res = await request(app).get('/api/electronic-exams');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].status).toBe('Randevu Alındı');
    });

    it('GET returns 500 when the service fails', async () => {
        electronicExamService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/electronic-exams');
        expect(res.statusCode).toBe(500);
    });
});
