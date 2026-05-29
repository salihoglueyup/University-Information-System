const express = require('express');
const request = require('supertest');

jest.mock('../services/contractService');
const contractService = require('../services/contractService');
const contractsRoute = require('../routes/contracts');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/contracts', contractsRoute);
app.use(errorHandler);

describe('Contracts API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists contracts', async () => {
        contractService.list.mockResolvedValue([{ name: 'KVKK Aydınlatma', status: 'Onay Bekliyor' }]);
        const res = await request(app).get('/api/contracts');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('PATCH /:id/status with a valid status signs the contract (200)', async () => {
        contractService.updateStatus.mockResolvedValue({ _id: '1', status: 'Onaylandı', date: '2026-05-29' });
        const res = await request(app).patch('/api/contracts/1/status').send({ status: 'Onaylandı' });
        expect(res.statusCode).toBe(200);
        expect(contractService.updateStatus).toHaveBeenCalledWith(undefined, '1', 'Onaylandı');
    });

    it('PATCH /:id/status with an invalid status is rejected (400)', async () => {
        const res = await request(app).patch('/api/contracts/1/status').send({ status: 'Bogus' });
        expect(res.statusCode).toBe(400);
        expect(contractService.updateStatus).not.toHaveBeenCalled();
    });
});
