const express = require('express');
const request = require('supertest');

jest.mock('../services/labService');
const labService = require('../services/labService');
const labsRoute = require('../routes/labs');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/labs', labsRoute);
app.use(errorHandler);

describe('Labs API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns lab sections', async () => {
        labService.list.mockResolvedValue([{ code: 'YZM101L', courseName: 'Programlama Lab' }]);
        const res = await request(app).get('/api/labs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(labService.list).toHaveBeenCalledTimes(1);
    });

    it('GET returns an empty array when there are none', async () => {
        labService.list.mockResolvedValue([]);
        const res = await request(app).get('/api/labs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});
