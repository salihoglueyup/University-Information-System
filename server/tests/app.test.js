const express = require('express');
const authRoute = require('../routes/auth');
const errorHandler = require('../middleware/errorHandler');

// This is a minimal Express App exclusively for SuperTest without starting DB/Sockets
const app = express();
app.use(express.json());

// Load Routes
app.use('/api/auth', authRoute);

app.use((err, req, res, next) => {
    console.error("TEST APP ERROR:", err);
    next(err);
});

// Global Error Handler
app.use(errorHandler);

describe('Test App Bootstrap', () => {
    it('should return 404 for unknown routes', async () => {
        const request = require('supertest');
        const res = await request(app).get('/__not_found__');
        expect(res.statusCode).toBe(404);
    });
});

module.exports = app;
