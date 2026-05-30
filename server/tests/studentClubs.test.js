const express = require('express');
const request = require('supertest');

jest.mock('../services/studentClubService');
const studentClubService = require('../services/studentClubService');
const studentClubsRoute = require('../routes/studentClubs');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/student-clubs', studentClubsRoute);
app.use(errorHandler);

describe('Student Clubs API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists clubs', async () => {
        studentClubService.list.mockResolvedValue([{ name: 'Robotik Kulübü', members: 120 }]);
        const res = await request(app).get('/api/student-clubs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST /:id/join joins a club (201)', async () => {
        studentClubService.join.mockResolvedValue({ id: '1', name: 'Robotik Kulübü', members: 121, joined: true });
        const res = await request(app).post('/api/student-clubs/1/join');
        expect(res.statusCode).toBe(201);
        expect(res.body.joined).toBe(true);
        expect(studentClubService.join).toHaveBeenCalledWith(undefined, '1');
    });

    it('POST /:id/join returns 404 for an unknown club', async () => {
        studentClubService.join.mockRejectedValue(new AppError('Kulüp bulunamadı', 404));
        const res = await request(app).post('/api/student-clubs/zzz/join');
        expect(res.statusCode).toBe(404);
    });
});
