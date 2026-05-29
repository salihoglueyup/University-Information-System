const express = require('express');
const request = require('supertest');

jest.mock('../services/erasmusService');
const erasmusService = require('../services/erasmusService');
const erasmusRoute = require('../routes/erasmus');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/erasmus', erasmusRoute);
app.use(errorHandler);

describe('Erasmus API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists applications', async () => {
        erasmusService.listApplications.mockResolvedValue([{ year: '2026', status: 'Asil' }]);
        const res = await request(app).get('/api/erasmus');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST with a valid year applies (201)', async () => {
        erasmusService.createApplication.mockResolvedValue({ _id: '1', year: '2026-2027' });
        const res = await request(app).post('/api/erasmus').send({ year: '2026-2027', term: 'Güz', score: 85 });
        expect(res.statusCode).toBe(201);
        expect(erasmusService.createApplication).toHaveBeenCalledTimes(1);
    });

    it('POST without a year is rejected (400)', async () => {
        const res = await request(app).post('/api/erasmus').send({ term: 'Güz' });
        expect(res.statusCode).toBe(400);
        expect(erasmusService.createApplication).not.toHaveBeenCalled();
    });

    it('GET /choices lists choices', async () => {
        erasmusService.listChoices.mockResolvedValue([{ university: 'TU Munich' }]);
        const res = await request(app).get('/api/erasmus/choices');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST /choices with a university creates (201)', async () => {
        erasmusService.createChoice.mockResolvedValue({ _id: '1', university: 'TU Munich' });
        const res = await request(app).post('/api/erasmus/choices').send({ university: 'TU Munich', country: 'Almanya', quota: 3 });
        expect(res.statusCode).toBe(201);
    });

    it('POST /choices without a university is rejected (400)', async () => {
        const res = await request(app).post('/api/erasmus/choices').send({ country: 'Almanya' });
        expect(res.statusCode).toBe(400);
        expect(erasmusService.createChoice).not.toHaveBeenCalled();
    });
});
