const express = require('express');
const request = require('supertest');

jest.mock('../services/uzemExamService');
const uzemExamService = require('../services/uzemExamService');
const uzemExamsRoute = require('../routes/uzemExams');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/uzem-exams', uzemExamsRoute);
app.use(errorHandler);

describe('UZEM Exams API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists online exams', async () => {
        uzemExamService.list.mockResolvedValue([{ code: 'BIL101', name: 'Programlama', status: 'Aktif' }]);
        const res = await request(app).get('/api/uzem-exams');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].status).toBe('Aktif');
    });

    it('GET returns 500 when the service fails', async () => {
        uzemExamService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/uzem-exams');
        expect(res.statusCode).toBe(500);
    });
});
