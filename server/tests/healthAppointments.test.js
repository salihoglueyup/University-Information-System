const express = require('express');
const request = require('supertest');

jest.mock('../services/healthAppointmentService');
const healthAppointmentService = require('../services/healthAppointmentService');
const healthAppointmentsRoute = require('../routes/healthAppointments');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/health-appointments', healthAppointmentsRoute);
app.use(errorHandler);

describe('Health Appointments API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists appointments', async () => {
        healthAppointmentService.list.mockResolvedValue([{ department: 'Diş', date: '2026-06-01', time: '10:00' }]);
        const res = await request(app).get('/api/health-appointments');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST with a valid appointment creates (201)', async () => {
        healthAppointmentService.create.mockResolvedValue({ _id: '1', department: 'Diş' });
        const res = await request(app).post('/api/health-appointments')
            .send({ department: 'Diş Hekimliği', doctor: 'Dr. Ada', date: '2026-06-01', time: '10:00' });
        expect(res.statusCode).toBe(201);
        expect(healthAppointmentService.create).toHaveBeenCalledTimes(1);
    });

    it('POST without a department is rejected (400)', async () => {
        const res = await request(app).post('/api/health-appointments').send({ date: '2026-06-01', time: '10:00' });
        expect(res.statusCode).toBe(400);
        expect(healthAppointmentService.create).not.toHaveBeenCalled();
    });
});
