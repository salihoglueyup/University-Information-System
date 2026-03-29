const { createClient } = require('redis');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MAX_REDIS_RETRY_ATTEMPTS = Number(process.env.REDIS_MAX_RETRIES || 3);

let redisDisabled = false;
let reconnectWarningLogged = false;
let startupErrorLogged = false;
let lastRedisErrorMessage = null;

const formatRedisError = (err) => {
    if (!err) {
        return 'Unknown Redis error';
    }

    if (err.message) {
        return err.message;
    }

    if (Array.isArray(err.errors) && err.errors.length > 0) {
        return err.errors
            .map((item) => item && item.message)
            .filter(Boolean)
            .join(' | ');
    }

    return String(err);
};

const redisClient = createClient({
    url: REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (redisDisabled) {
                return false;
            }

            if (retries >= MAX_REDIS_RETRY_ATTEMPTS) {
                redisDisabled = true;
                if (!reconnectWarningLogged) {
                    reconnectWarningLogged = true;
                    logger.warn(`Redis is unavailable after ${MAX_REDIS_RETRY_ATTEMPTS} retries. Redis-backed features will be disabled.`);
                }
                return false;
            }

            return Math.min(250 * (2 ** retries), 3000);
        }
    }
});

redisClient.on('error', (err) => {
    if (redisDisabled) {
        return;
    }

    const formattedError = formatRedisError(err);
    if (formattedError !== lastRedisErrorMessage) {
        logger.warn(`Redis connection error: ${formattedError}`);
        lastRedisErrorMessage = formattedError;
    }
});

redisClient.on('connect', () => {
    logger.info('Redis cache connection established.');
    startupErrorLogged = false;
    lastRedisErrorMessage = null;
});

redisClient.on('end', () => {
    if (!redisDisabled) {
        logger.warn('Redis connection closed.');
    }
});

// Initialize connection async
(async () => {
    try {
        await redisClient.connect();
    } catch (e) {
        if (!startupErrorLogged) {
            startupErrorLogged = true;
            logger.warn(`Redis is unreachable on startup. Continuing without Redis. Details: ${formatRedisError(e)}`);
        }
    }
})();

module.exports = redisClient;
