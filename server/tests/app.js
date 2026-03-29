const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth');

/**
 * Creates an Express app instance for testing (without starting the server or DB connection).
 */
function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/auth', authRoute);
    return app;
}

module.exports = { createApp };
