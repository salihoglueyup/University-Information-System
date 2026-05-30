const express = require('express');
const request = require('supertest');

jest.mock('../services/deptTaskService');
const deptTaskService = require('../services/deptTaskService');
const deptTasksRoute = require('../routes/deptTasks');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/dept-tasks', deptTasksRoute);
app.use(errorHandler);

describe('Department Tasks API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists tasks', async () => {
        deptTaskService.list.mockResolvedValue([{ task: 'Ders programı hazırla', status: 'todo' }]);
        const res = await request(app).get('/api/dept-tasks');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('PATCH /:id/status updates status (200)', async () => {
        deptTaskService.setStatus.mockResolvedValue({ _id: '1', status: 'done' });
        const res = await request(app).patch('/api/dept-tasks/1/status').send({ status: 'done' });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('done');
        expect(deptTaskService.setStatus).toHaveBeenCalledWith(undefined, '1', 'done');
    });

    it('PATCH /:id/status with an invalid status is rejected (400)', async () => {
        const res = await request(app).patch('/api/dept-tasks/1/status').send({ status: 'bogus' });
        expect(res.statusCode).toBe(400);
        expect(deptTaskService.setStatus).not.toHaveBeenCalled();
    });

    it('PATCH /:id/status returns 404 when the task is missing', async () => {
        deptTaskService.setStatus.mockRejectedValue(new AppError('Görev bulunamadı', 404));
        const res = await request(app).patch('/api/dept-tasks/zzz/status').send({ status: 'done' });
        expect(res.statusCode).toBe(404);
    });
});
