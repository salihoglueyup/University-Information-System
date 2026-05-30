const express = require('express');
const request = require('supertest');

jest.mock('../services/systemSettingService');
const systemSettingService = require('../services/systemSettingService');
const systemSettingsRoute = require('../routes/systemSettings');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/system-settings', systemSettingsRoute);
app.use(errorHandler);

describe('System Settings API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns the settings', async () => {
        systemSettingService.get.mockResolvedValue({ activeSemester: '2023-2024 Güz', maintenanceMode: false });
        const res = await request(app).get('/api/system-settings');
        expect(res.statusCode).toBe(200);
        expect(res.body.activeSemester).toBe('2023-2024 Güz');
    });

    it('PATCH updates the settings (200)', async () => {
        systemSettingService.update.mockResolvedValue({ maintenanceMode: true });
        const res = await request(app).patch('/api/system-settings').send({ maintenanceMode: true });
        expect(res.statusCode).toBe(200);
        expect(res.body.maintenanceMode).toBe(true);
        expect(systemSettingService.update).toHaveBeenCalledWith({ maintenanceMode: true });
    });

    it('PATCH with an invalid type is rejected (400)', async () => {
        const res = await request(app).patch('/api/system-settings').send({ maintenanceMode: 'evet' });
        expect(res.statusCode).toBe(400);
        expect(systemSettingService.update).not.toHaveBeenCalled();
    });
});
