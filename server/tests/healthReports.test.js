const express = require('express');
const request = require('supertest');

// Mock the service so the route can be tested without a database.
jest.mock('../services/healthReportService');
const healthReportService = require('../services/healthReportService');
const healthRoute = require('../routes/healthReports');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/health-reports', healthRoute);
app.use(errorHandler);

describe('Health Reports API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET /api/health-reports returns the list', async () => {
        healthReportService.list.mockResolvedValue([{ hospital: 'Acıbadem', diagnosis: 'Grip' }]);
        const res = await request(app).get('/api/health-reports');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(healthReportService.list).toHaveBeenCalledTimes(1);
    });

    it('POST with a valid body creates a report (201)', async () => {
        healthReportService.create.mockResolvedValue({ _id: '1', hospital: 'Acıbadem', diagnosis: 'Grip', days: 3, status: 'Bekliyor' });
        const res = await request(app)
            .post('/api/health-reports')
            .send({ hospital: 'Acıbadem', diagnosis: 'Grip', date: '2026-06-01', days: 3 });
        expect(res.statusCode).toBe(201);
        expect(healthReportService.create).toHaveBeenCalledTimes(1);
    });

    it('coerces a numeric-string day count', async () => {
        healthReportService.create.mockResolvedValue({});
        const res = await request(app)
            .post('/api/health-reports')
            .send({ hospital: 'Acıbadem', diagnosis: 'Grip', date: '2026-06-01', days: '5' });
        expect(res.statusCode).toBe(201);
        // Zod coerces '5' -> 5 before reaching the service
        expect(healthReportService.create.mock.calls[0][1].days).toBe(5);
    });

    it('rejects a missing diagnosis (400) and does not hit the service', async () => {
        const res = await request(app)
            .post('/api/health-reports')
            .send({ hospital: 'Acıbadem', date: '2026-06-01', days: 3 });
        expect(res.statusCode).toBe(400);
        expect(healthReportService.create).not.toHaveBeenCalled();
    });

    it('rejects an invalid day count (400)', async () => {
        const res = await request(app)
            .post('/api/health-reports')
            .send({ hospital: 'Acıbadem', diagnosis: 'Grip', date: '2026-06-01', days: 0 });
        expect(res.statusCode).toBe(400);
        expect(healthReportService.create).not.toHaveBeenCalled();
    });
});
