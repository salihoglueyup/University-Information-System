const express = require('express');
const request = require('supertest');

jest.mock('../services/onlineCourseService');
const onlineCourseService = require('../services/onlineCourseService');
const onlineCoursesRoute = require('../routes/onlineCourses');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/online-courses', onlineCoursesRoute);
app.use(errorHandler);

describe('Online Courses API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists online courses', async () => {
        onlineCourseService.list.mockResolvedValue([{ code: 'BIL101', name: 'Programlama', progress: 60 }]);
        const res = await request(app).get('/api/online-courses');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].code).toBe('BIL101');
    });

    it('GET returns 500 when the service fails', async () => {
        onlineCourseService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/online-courses');
        expect(res.statusCode).toBe(500);
    });
});
