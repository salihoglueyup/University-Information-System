const express = require('express');
const request = require('supertest');

jest.mock('../services/academicProgressService');
const academicProgressService = require('../services/academicProgressService');
const apRoute = require('../routes/academicProgress');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/academic-progress', apRoute);
app.use(errorHandler);

describe('Academic Progress API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the progress record', async () => {
        academicProgressService.getProgress.mockResolvedValue({ program: 'Doktora', publications: [], milestones: [] });
        const res = await request(app).get('/api/academic-progress');
        expect(res.statusCode).toBe(200);
        expect(res.body.program).toBe('Doktora');
    });

    it('POST /publications with a valid title adds a publication (201)', async () => {
        academicProgressService.addPublication.mockResolvedValue({ publications: [{ title: 'Makale' }] });
        const res = await request(app).post('/api/academic-progress/publications')
            .send({ title: 'Derin Öğrenme ile Sınıflandırma', journal: 'IEEE', status: 'İncelemede' });
        expect(res.statusCode).toBe(201);
        expect(academicProgressService.addPublication).toHaveBeenCalledTimes(1);
    });

    it('POST /publications without a title is rejected (400)', async () => {
        const res = await request(app).post('/api/academic-progress/publications').send({ journal: 'IEEE' });
        expect(res.statusCode).toBe(400);
        expect(academicProgressService.addPublication).not.toHaveBeenCalled();
    });

    it('POST /publications with an invalid status is rejected (400)', async () => {
        const res = await request(app).post('/api/academic-progress/publications')
            .send({ title: 'Makale', status: 'Bogus' });
        expect(res.statusCode).toBe(400);
    });
});
