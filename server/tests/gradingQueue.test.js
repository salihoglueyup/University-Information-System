const express = require('express');
const request = require('supertest');

jest.mock('../services/gradingTaskService');
const gradingTaskService = require('../services/gradingTaskService');
const gradingQueueRoute = require('../routes/gradingQueue');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/grading-queue', gradingQueueRoute);
app.use(errorHandler);

describe('Grading Queue API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists grading tasks', async () => {
        gradingTaskService.list.mockResolvedValue([{ courseName: 'Algoritma', type: 'Vize', pendingCount: 12 }]);
        const res = await request(app).get('/api/grading-queue');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].pendingCount).toBe(12);
    });

    it('GET returns 500 when the service fails', async () => {
        gradingTaskService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/grading-queue');
        expect(res.statusCode).toBe(500);
    });
});
