const express = require('express');
const request = require('supertest');

jest.mock('../services/departmentCourseService');
const departmentCourseService = require('../services/departmentCourseService');
const departmentCoursesRoute = require('../routes/departmentCourses');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/department-courses', departmentCoursesRoute);
app.use(errorHandler);

describe('Department Courses API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists the curriculum', async () => {
        departmentCourseService.list.mockResolvedValue([{ code: 'BIL101', name: 'Programlama', credit: 4, ects: 6, semester: 1, type: 'Zorunlu' }]);
        const res = await request(app).get('/api/department-courses');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].type).toBe('Zorunlu');
    });

    it('GET returns 500 when the service fails', async () => {
        departmentCourseService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/department-courses');
        expect(res.statusCode).toBe(500);
    });
});
