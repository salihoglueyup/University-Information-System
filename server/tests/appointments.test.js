const express = require('express');
const request = require('supertest');

jest.mock('../services/appointmentService');
jest.mock('../services/officeHourService');
const appointmentService = require('../services/appointmentService');
const officeHourService = require('../services/officeHourService');
const appointmentsRoute = require('../routes/appointments');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/appointments', appointmentsRoute);
app.use(errorHandler);

describe('Appointments API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists appointments', async () => {
        appointmentService.list.mockResolvedValue([{ student: 'Ali', topic: 'Tez' }]);
        const res = await request(app).get('/api/appointments');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST with a valid appointment creates (201)', async () => {
        appointmentService.create.mockResolvedValue({ _id: '1', student: 'Ali' });
        const res = await request(app).post('/api/appointments')
            .send({ student: 'Ali', topic: 'Tez görüşmesi', date: '2026-06-10', time: '14:00', type: 'Online' });
        expect(res.statusCode).toBe(201);
        expect(appointmentService.create).toHaveBeenCalledTimes(1);
    });

    it('POST without a topic is rejected (400)', async () => {
        const res = await request(app).post('/api/appointments')
            .send({ student: 'Ali', date: '2026-06-10', time: '14:00' });
        expect(res.statusCode).toBe(400);
        expect(appointmentService.create).not.toHaveBeenCalled();
    });

    it('PATCH /:id/status with a valid status updates (200)', async () => {
        appointmentService.updateStatus.mockResolvedValue({ _id: '1', status: 'Onaylandı' });
        const res = await request(app).patch('/api/appointments/1/status').send({ status: 'Onaylandı' });
        expect(res.statusCode).toBe(200);
        expect(appointmentService.updateStatus).toHaveBeenCalledWith(undefined, '1', 'Onaylandı');
    });

    it('PATCH /:id/status with an invalid status is rejected (400)', async () => {
        const res = await request(app).patch('/api/appointments/1/status').send({ status: 'Bogus' });
        expect(res.statusCode).toBe(400);
        expect(appointmentService.updateStatus).not.toHaveBeenCalled();
    });

    it('GET /office-hours lists slots', async () => {
        officeHourService.list.mockResolvedValue([{ day: 'Pazartesi', time: '10:00-12:00' }]);
        const res = await request(app).get('/api/appointments/office-hours');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST /office-hours with a valid slot creates (201)', async () => {
        officeHourService.create.mockResolvedValue({ _id: '1', day: 'Pazartesi' });
        const res = await request(app).post('/api/appointments/office-hours')
            .send({ day: 'Pazartesi', time: '10:00-12:00', location: 'B-204' });
        expect(res.statusCode).toBe(201);
    });

    it('POST /office-hours without a day is rejected (400)', async () => {
        const res = await request(app).post('/api/appointments/office-hours').send({ time: '10:00-12:00' });
        expect(res.statusCode).toBe(400);
        expect(officeHourService.create).not.toHaveBeenCalled();
    });

    it('DELETE /office-hours/:id removes a slot (204)', async () => {
        officeHourService.remove.mockResolvedValue({ _id: '1' });
        const res = await request(app).delete('/api/appointments/office-hours/1');
        expect(res.statusCode).toBe(204);
        expect(officeHourService.remove).toHaveBeenCalledWith(undefined, '1');
    });

    it('DELETE /office-hours/:id returns 404 when missing', async () => {
        const AppError = require('../utils/AppError');
        officeHourService.remove.mockRejectedValue(new AppError('Ofis saati bulunamadı', 404));
        const res = await request(app).delete('/api/appointments/office-hours/zzz');
        expect(res.statusCode).toBe(404);
    });
});
