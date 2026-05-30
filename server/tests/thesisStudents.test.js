const express = require('express');
const request = require('supertest');

jest.mock('../services/thesisStudentService');
const thesisStudentService = require('../services/thesisStudentService');
const thesisStudentsRoute = require('../routes/thesisStudents');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/thesis-students', thesisStudentsRoute);
app.use(errorHandler);

describe('Thesis Students API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists thesis students', async () => {
        thesisStudentService.list.mockResolvedValue([{ name: 'Ali Veli', projectTitle: 'Derin Öğrenme', progress: 60 }]);
        const res = await request(app).get('/api/thesis-students');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].progress).toBe(60);
    });

    it('GET returns 500 when the service fails', async () => {
        thesisStudentService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/thesis-students');
        expect(res.statusCode).toBe(500);
    });
});
