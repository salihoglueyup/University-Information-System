const express = require('express');
const request = require('supertest');

jest.mock('../services/sportsFacilityService');
const sportsFacilityService = require('../services/sportsFacilityService');
const sportsFacilitiesRoute = require('../routes/sportsFacilities');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/sports-facilities', sportsFacilitiesRoute);
app.use(errorHandler);

describe('Sports Facilities API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists facilities', async () => {
        sportsFacilityService.list.mockResolvedValue([{ name: 'Kapalı Spor Salonu', status: 'Açık', occupancy: 45 }]);
        const res = await request(app).get('/api/sports-facilities');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].status).toBe('Açık');
    });

    it('GET returns 500 when the service fails', async () => {
        sportsFacilityService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/sports-facilities');
        expect(res.statusCode).toBe(500);
    });
});
