const express = require('express');
const request = require('supertest');

jest.mock('../services/jobService');
const jobService = require('../services/jobService');
const jobsRoute = require('../routes/jobs');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/jobs', jobsRoute);
app.use(errorHandler);

describe('Jobs API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the listings', async () => {
        jobService.list.mockResolvedValue([{ title: 'Frontend Stajyeri', type: 'Staj' }]);
        const res = await request(app).get('/api/jobs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(jobService.list).toHaveBeenCalledTimes(1);
    });

    it('GET returns an empty array when there are no listings', async () => {
        jobService.list.mockResolvedValue([]);
        const res = await request(app).get('/api/jobs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});
