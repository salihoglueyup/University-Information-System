const express = require('express');
const request = require('supertest');

jest.mock('../services/vehicleService');
const vehicleService = require('../services/vehicleService');
const vehicleRoute = require('../routes/vehicle');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/vehicle', vehicleRoute);
app.use(errorHandler);

describe('Vehicle API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the current vehicle', async () => {
        vehicleService.getCurrent.mockResolvedValue({ plate: '34 ABC 123', status: 'Aktif' });
        const res = await request(app).get('/api/vehicle');
        expect(res.statusCode).toBe(200);
        expect(res.body.plate).toBe('34 ABC 123');
    });

    it('POST with a valid plate + model applies (201)', async () => {
        vehicleService.apply.mockResolvedValue({ _id: '1', plate: '34 ABC 123', status: 'Beklemede' });
        const res = await request(app).post('/api/vehicle').send({ plate: '34 ABC 123', model: 'Renault Clio' });
        expect(res.statusCode).toBe(201);
        expect(vehicleService.apply).toHaveBeenCalledTimes(1);
    });

    it('rejects a missing plate (400)', async () => {
        const res = await request(app).post('/api/vehicle').send({ model: 'Renault Clio' });
        expect(res.statusCode).toBe(400);
        expect(vehicleService.apply).not.toHaveBeenCalled();
    });

    it('rejects a too-short plate (400)', async () => {
        const res = await request(app).post('/api/vehicle').send({ plate: '34', model: 'Clio' });
        expect(res.statusCode).toBe(400);
    });

    it('rejects a missing model (400)', async () => {
        const res = await request(app).post('/api/vehicle').send({ plate: '34 ABC 123' });
        expect(res.statusCode).toBe(400);
    });
});
