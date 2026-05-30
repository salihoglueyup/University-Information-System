const express = require('express');
const request = require('supertest');

jest.mock('../services/thesisTaskService');
const thesisTaskService = require('../services/thesisTaskService');
const thesisTasksRoute = require('../routes/thesisTasks');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/thesis-tasks', thesisTasksRoute);
app.use(errorHandler);

describe('Thesis Tasks (Kanban) API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /board returns columns and items', async () => {
        thesisTaskService.getBoard.mockResolvedValue({ columns: [{ id: 'todo' }], items: [{ content: 'Taslak' }] });
        const res = await request(app).get('/api/thesis-tasks/board');
        expect(res.statusCode).toBe(200);
        expect(res.body.columns).toHaveLength(1);
        expect(res.body.items).toHaveLength(1);
    });

    it('PATCH /:id moves a card (200)', async () => {
        thesisTaskService.move.mockResolvedValue({ _id: '1', column: 'completed' });
        const res = await request(app).patch('/api/thesis-tasks/1').send({ column: 'completed' });
        expect(res.statusCode).toBe(200);
        expect(thesisTaskService.move).toHaveBeenCalledWith(undefined, '1', 'completed');
    });

    it('PATCH /:id with an invalid column is rejected (400)', async () => {
        const res = await request(app).patch('/api/thesis-tasks/1').send({ column: 'bogus' });
        expect(res.statusCode).toBe(400);
        expect(thesisTaskService.move).not.toHaveBeenCalled();
    });

    it('PATCH /:id returns 404 when the card is missing', async () => {
        thesisTaskService.move.mockRejectedValue(new AppError('Görev bulunamadı', 404));
        const res = await request(app).patch('/api/thesis-tasks/zzz').send({ column: 'todo' });
        expect(res.statusCode).toBe(404);
    });

    it('PATCH /:id/reorder updates order (200)', async () => {
        thesisTaskService.reorder.mockResolvedValue({ _id: '1', order: 2 });
        const res = await request(app).patch('/api/thesis-tasks/1/reorder').send({ newIndex: 2 });
        expect(res.statusCode).toBe(200);
        expect(thesisTaskService.reorder).toHaveBeenCalledWith(undefined, '1', 2);
    });
});
