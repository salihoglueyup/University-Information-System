const express = require('express');
const request = require('supertest');

jest.mock('../services/academicReportService');
const academicReportService = require('../services/academicReportService');
const academicReportsRoute = require('../routes/academicReports');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/academic-reports', academicReportsRoute);
app.use(errorHandler);

describe('Academic Reports API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the report data', async () => {
        academicReportService.get.mockResolvedValue({ facultyStats: [{ name: 'Mühendislik', students: 1200 }], enrollmentTrends: [] });
        const res = await request(app).get('/api/academic-reports');
        expect(res.statusCode).toBe(200);
        expect(res.body.facultyStats).toHaveLength(1);
    });

    it('GET returns null when there is no report', async () => {
        academicReportService.get.mockResolvedValue(null);
        const res = await request(app).get('/api/academic-reports');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeNull();
    });

    it('GET returns 500 when the service fails', async () => {
        academicReportService.get.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/academic-reports');
        expect(res.statusCode).toBe(500);
    });
});
