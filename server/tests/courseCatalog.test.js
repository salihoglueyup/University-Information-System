const express = require('express');
const request = require('supertest');

jest.mock('../services/catalogCourseService');
const catalogCourseService = require('../services/catalogCourseService');
const courseCatalogRoute = require('../routes/courseCatalog');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/course-catalog', courseCatalogRoute);
app.use(errorHandler);

describe('Course Catalog API', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET lists the catalog', async () => {
        catalogCourseService.list.mockResolvedValue([{ code: 'YZM401', courseName: 'Yazılım Test', credit: 3, ects: 5, semester: 7, type: 'Zorunlu' }]);
        const res = await request(app).get('/api/course-catalog');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].courseName).toBe('Yazılım Test');
    });

    it('GET returns 500 when the service fails', async () => {
        catalogCourseService.list.mockRejectedValue(new Error('db down'));
        const res = await request(app).get('/api/course-catalog');
        expect(res.statusCode).toBe(500);
    });
});
