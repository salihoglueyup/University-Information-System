const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redisClient = require('./utils/redisClient');
const mongoSanitizeCompat = require('./middleware/mongoSanitizeCompat');
const cookieParser = require('cookie-parser');
const { doubleCsrf } = require('csrf-csrf');
const authRoute = require('./routes/auth');
const promBundle = require('express-prom-bundle');
const logger = require('./utils/logger');
const coursesRoute = require('./routes/courses');
const announcementsRoute = require('./routes/announcements');
const scheduleRoute = require('./routes/schedule');
const assignmentsRoute = require('./routes/assignments');
const academicCalendarRoute = require('./routes/academic-calendar');
const gradesRoute = require('./routes/grades');
const attendanceRoute = require('./routes/attendance');
const facultiesRoute = require('./routes/faculties');
const departmentsRoute = require('./routes/departments');
const studentsRoute = require('./routes/students');
const usersRoute = require('./routes/users');
const logsRoute = require('./routes/logs');
const dormitoryRoute = require('./routes/dormitory');
const libraryRoute = require('./routes/library');
const emailsRoute = require('./routes/emails');
const documentsRoute = require('./routes/documents');
const paymentsRoute = require('./routes/payments');
const evaluationsRoute = require('./routes/evaluations');
const searchRoute = require('./routes/search');
const analyticsRoute = require('./routes/analytics');
const verificationsRoute = require('./routes/verifications');
const aiRoute = require('./routes/ai');
const notificationsRoute = require('./routes/notifications');
const lostFoundRoute = require('./routes/lostfound');
const leaveRoute = require('./routes/leave');
const supportRoute = require('./routes/support');
const scholarshipsRoute = require('./routes/scholarships');
const { verifyToken, verifyRole } = require('./middleware/auth');
const secureUploads = require('./middleware/secureUploads');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
dotenv.config();

const app = express();
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.io
const socketAPI = require('./socket');
const io = socketAPI.init(server);
app.set("io", io);

// Prometheus Metrics Middleware
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: { project_name: 'ubis_obs' },
    promClient: {
        collectDefaultMetrics: {
        }
    }
});
app.use(metricsMiddleware);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info("DB Connection Successful!");
        require('./jobs/cronTasks'); // Başlangıçta cron jobları yükle
        
        // Start RabbitMQ Consumers
        const { startNotificationConsumer } = require('./consumers/notificationConsumer');
        startNotificationConsumer();
    })
    .catch((err) => {
        logger.error(`Database connection error: ${err.message}`);
    });

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = CLIENT_URL.split(',').map(o => o.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitizeCompat);

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    // Production logging through winston instead of morgan
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

app.use(express.json({ limit: '1mb' }));

let memoryRateLimitFallbackLogged = false;

const buildRateLimitOptions = (baseOptions) => {
    if (redisClient.isReady) {
        return {
            ...baseOptions,
            store: new RedisStore({
                sendCommand: (...args) => redisClient.sendCommand(args),
            }),
        };
    }

    if (!memoryRateLimitFallbackLogged) {
        memoryRateLimitFallbackLogged = true;
        logger.warn('Redis is not ready. Falling back to in-memory rate limiting.');
    }
    return baseOptions;
};

// Rate limiting
const generalLimiter = rateLimit(buildRateLimitOptions({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
}));

const authLimiter = rateLimit(buildRateLimitOptions({
    windowMs: 15 * 60 * 1000,
    max: 20, // stricter limit for auth routes
    message: { error: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use(cookieParser());

// CSRF Protection using Double Submit Cookie pattern (csrf-csrf)
// Replaces deprecated csurf package, fully compatible with Express 5
const { doubleCsrfProtection, generateToken } = doubleCsrf({
    getSecret: () => {
        if (!process.env.CSRF_SECRET && !process.env.JWT_SEC) {
            logger.error('CSRF_SECRET or JWT_SEC environment variable must be set');
            throw new Error('Missing CSRF secret configuration');
        }
        return process.env.CSRF_SECRET || process.env.JWT_SEC;
    },
    cookieName: process.env.NODE_ENV === 'production'
        ? '__Host-ubis.x-csrf-token'
        : 'ubis.x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: (req) => req.headers['x-csrf-token']
});

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use("/api/auth", authRoute);

// Provide CSRF Token to Frontend
app.get('/api/csrf-token', (req, res) => {
    try {
        const csrfToken = generateToken(req, res);
        res.json({ csrfToken });
    } catch (error) {
        logger.error(`CSRF token generation failed: ${error.message}`);
        res.status(500).json({ error: 'Failed to generate CSRF token' });
    }
});

// Protect all /api routes below with CSRF (except GET/HEAD/OPTIONS)
app.use('/api', doubleCsrfProtection);
app.use("/api/verifications", verificationsRoute);
app.use("/api/courses", verifyToken, coursesRoute);
app.use("/api/announcements", verifyToken, announcementsRoute);
app.use("/api/assignments", verifyToken, assignmentsRoute);
// Protect API routes
app.use("/api/academic-calendar", verifyToken, academicCalendarRoute);
app.use("/api/schedule", verifyToken, scheduleRoute);
app.use("/api/grades", verifyToken, gradesRoute);
app.use("/api/attendance", verifyToken, attendanceRoute);
app.use("/api/faculties", verifyToken, facultiesRoute);
app.use("/api/departments", verifyToken, departmentsRoute);
app.use("/api/students", verifyToken, studentsRoute);
app.use("/api/users", verifyToken, usersRoute);
app.use("/api/logs", verifyRole(['admin']), logsRoute);
app.use("/api/dormitory", verifyToken, dormitoryRoute);
app.use("/api/library", verifyToken, libraryRoute);
app.use("/api/emails", verifyToken, emailsRoute);
app.use("/api/documents", verifyToken, documentsRoute);
app.use("/api/payments", verifyToken, paymentsRoute);
app.use("/api/evaluations", verifyToken, evaluationsRoute);
app.use("/api/search", verifyToken, searchRoute);
app.use("/api/analytics", verifyToken, verifyRole(['admin']), analyticsRoute); // Sadece Admin görebilsin
app.use("/api/ai", verifyToken, aiRoute);
app.use("/api/notifications", verifyToken, notificationsRoute);
app.use("/api/lost-found", verifyToken, lostFoundRoute);
app.use("/api/leave", verifyToken, leaveRoute);
app.use("/api/support", verifyToken, supportRoute);
app.use("/api/scholarships", verifyToken, scholarshipsRoute);

// Serve uploads with access control
app.use('/uploads', secureUploads, express.static(path.join(__dirname, 'uploads')));

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "UBIS API Documentation"
}));

app.get('/', (req, res) => {
    res.send('IAU UBIS API is running');
});

// Global Error Handling Middleware (must be after all routes)
app.use(errorHandler);

const BASE_PORT = Number(process.env.PORT) || 5000;
let http_server;

const startHttpServer = (port, attempt = 0) => {
    const MAX_PORT_RETRIES = 10;

    const handleError = (err) => {
        server.removeListener('listening', handleListening);

        if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_RETRIES) {
            const nextPort = port + 1;
            logger.warn(`Port ${port} is already in use. Retrying on ${nextPort}...`);
            startHttpServer(nextPort, attempt + 1);
            return;
        }

        logger.error(`HTTP server failed to start: ${err.message}`);
        process.exit(1);
    };

    const handleListening = () => {
        server.removeListener('error', handleError);
        http_server = server;
        logger.info(`Backend server with Socket.io is running on port ${port}`);
    };

    server.once('error', handleError);
    server.once('listening', handleListening);
    server.listen(port);
};

startHttpServer(BASE_PORT);

// ============================
// Graceful Shutdown Management
// ============================
const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting Graceful Shutdown...`);

    if (!http_server) {
        logger.warn('HTTP server was not started yet. Exiting directly.');
        process.exit(0);
    }

    http_server.close(async () => {
        logger.info('HTTP server closed.');

        try {
            // Close MongoDB Connection
            await mongoose.connection.close(false);
            logger.info('MongoDB connection closed.');

            // Close Redis Client
            if (redisClient.isOpen) {
                await redisClient.quit();
                logger.info('Redis connection closed.');
            }

            // Close RabbitMQ Broker
            const messageBroker = require('./utils/messageBroker');
            const brokerChannel = messageBroker.getChannel();
            const brokerConnection = messageBroker.getConnection();
            if (brokerChannel) await brokerChannel.close();
            if (brokerConnection) await brokerConnection.close();
            logger.info('RabbitMQ connection closed.');

            logger.info('Graceful Shutdown Completed. Exiting process safely.');
            process.exit(0);
        } catch (err) {
            logger.error(`Error during shutdown: ${err.message}`);
            process.exit(1);
        }
    });

    // Forced shutdown if it takes too long (10s)
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
