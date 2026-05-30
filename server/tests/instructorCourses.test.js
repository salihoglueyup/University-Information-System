const express = require('express');
const request = require('supertest');

jest.mock('../services/instructorCourseService');
const instructorCourseService = require('../services/instructorCourseService');
const instructorCoursesRoute = require('../routes/instructorCourses');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/instructor-courses', instructorCoursesRoute);
app.use(errorHandler);

describe('Instructor Courses API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists the taught courses', async () => {
        instructorCourseService.list.mockResolvedValue([{ code: 'YZM401', name: 'Yazılım Test', studentsEnrolled: 42 }]);
        const res = await request(app).get('/api/instructor-courses');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].code).toBe('YZM401');
    });

    it('GET returns 500 when the service fails', async () => {
        instructorCourseService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/instructor-courses');
        expect(res.statusCode).toBe(500);
    });
});
