const express = require('express');
const request = require('supertest');

jest.mock('../services/thesisMilestoneService');
const thesisMilestoneService = require('../services/thesisMilestoneService');
const thesisMilestonesRoute = require('../routes/thesisMilestones');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/thesis-milestones', thesisMilestonesRoute);
app.use(errorHandler);

describe('Thesis Milestones API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /:thesisId returns the milestone plan', async () => {
        thesisMilestoneService.get.mockResolvedValue({ project: 'Derin Öğrenme', milestones: [{ id: 1, title: 'Literatür', status: 'Tamamlandı' }] });
        const res = await request(app).get('/api/thesis-milestones/abc');
        expect(res.statusCode).toBe(200);
        expect(res.body.project).toBe('Derin Öğrenme');
        expect(thesisMilestoneService.get).toHaveBeenCalledWith('abc');
    });

    it('GET /:thesisId returns null when there is no plan', async () => {
        thesisMilestoneService.get.mockResolvedValue(null);
        const res = await request(app).get('/api/thesis-milestones/zzz');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeNull();
    });

    it('GET /:thesisId returns 500 when the service fails', async () => {
        thesisMilestoneService.get.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/thesis-milestones/abc');
        expect(res.statusCode).toBe(500);
    });
});
