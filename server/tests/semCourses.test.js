const express = require('express');
const request = require('supertest');

jest.mock('../services/semCourseService');
const semCourseService = require('../services/semCourseService');
const semCoursesRoute = require('../routes/semCourses');
const errorHandler = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');

const app = express();
app.use(express.json());
app.use('/api/sem-courses', semCoursesRoute);
app.use(errorHandler);

describe('SEM Courses API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists the catalog', async () => {
        semCourseService.list.mockResolvedValue([{ title: 'Veri Bilimi', price: '1500 ₺' }]);
        const res = await request(app).get('/api/sem-courses');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('POST /:id/enroll enrolls the user (201)', async () => {
        semCourseService.enroll.mockResolvedValue({ id: '1', title: 'Veri Bilimi', enrolled: true });
        const res = await request(app).post('/api/sem-courses/1/enroll');
        expect(res.statusCode).toBe(201);
        expect(res.body.enrolled).toBe(true);
        expect(semCourseService.enroll).toHaveBeenCalledWith(undefined, '1');
    });

    it('POST /:id/enroll returns 404 for an unknown program', async () => {
        semCourseService.enroll.mockRejectedValue(new AppError('Eğitim programı bulunamadı', 404));
        const res = await request(app).post('/api/sem-courses/zzz/enroll');
        expect(res.statusCode).toBe(404);
    });
});
