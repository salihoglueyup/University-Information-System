const express = require('express');
const request = require('supertest');

jest.mock('../services/examApplicationService');
const examApplicationService = require('../services/examApplicationService');
const examApplicationsRoute = require('../routes/examApplications');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/exam-applications', examApplicationsRoute);
app.use(errorHandler);

describe('Exam Applications API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists available exams', async () => {
        examApplicationService.list.mockResolvedValue([{ name: 'İngilizce Muafiyet', type: 'Muafiyet Sınavı' }]);
        const res = await request(app).get('/api/exam-applications');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST /:id/apply applies for an exam (201)', async () => {
        examApplicationService.apply.mockResolvedValue({ id: '1', name: 'İngilizce Muafiyet', applied: true });
        const res = await request(app).post('/api/exam-applications/1/apply');
        expect(res.statusCode).toBe(201);
        expect(res.body.applied).toBe(true);
        expect(examApplicationService.apply).toHaveBeenCalledWith(undefined, '1');
    });

    it('POST /:id/apply returns 404 for an unknown exam', async () => {
        examApplicationService.apply.mockRejectedValue(new AppError('Sınav bulunamadı', 404));
        const res = await request(app).post('/api/exam-applications/zzz/apply');
        expect(res.statusCode).toBe(404);
    });
});
