const express = require('express');
const request = require('supertest');

jest.mock('../services/financialReportService');
const financialReportService = require('../services/financialReportService');
const financialReportsRoute = require('../routes/financialReports');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/financial-reports', financialReportsRoute);
app.use(errorHandler);

describe('Financial Reports API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the report data', async () => {
        financialReportService.get.mockResolvedValue({ paymentStats: [{ name: 'Ödendi', value: 80, color: '#10B981' }], monthlyRevenue: [] });
        const res = await request(app).get('/api/financial-reports');
        expect(res.statusCode).toBe(200);
        expect(res.body.paymentStats).toHaveLength(1);
    });

    it('GET returns null when there is no report', async () => {
        financialReportService.get.mockResolvedValue(null);
        const res = await request(app).get('/api/financial-reports');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeNull();
    });

    it('GET returns 500 when the service fails', async () => {
        financialReportService.get.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/financial-reports');
        expect(res.statusCode).toBe(500);
    });
});
