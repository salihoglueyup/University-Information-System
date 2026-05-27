const redisClient = require('../utils/redisClient');
const logger = require('../utils/logger');

const CACHE_TTL = 600; // 600 seconds = 10 minutes

const cacheMiddleware = async (req, res, next) => {
    // We only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    if (req.query && req.query.nocache === '1') {
        return next();
    }

    const userScope = req.user && req.user.id ? req.user.id : 'anon';
    const key = `api-cache:${userScope}:${req.method}:${req.originalUrl || req.url}`;

    try {
        // If Redis is not connected, just skip caching
        if (!redisClient.isReady) {
            logger.warn("Redis is not ready. Skipping cache.");
            return next();
        }

        const cachedData = await redisClient.get(key);

        if (cachedData) {
            // logger.info(`🚀 [Redis] Cache hit for ${key}`);
            res.set('X-Cache', 'HIT');
            return res.status(200).json(JSON.parse(cachedData));
        }

        // logger.info(`🐌 [Redis] Cache miss for ${key}`);
        res.set('X-Cache', 'MISS');
        // Intercept res.json
        res.originalJson = res.json;
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Save to Redis async in the background
                redisClient.setEx(key, CACHE_TTL, JSON.stringify(body)).catch(err => {
                    logger.error(`Redis Cache Save Error: ${err.message}`);
                });
            }
            res.originalJson(body);
        };
        next();
    } catch (err) {
        logger.error(`Redis Cache Middleware Error: ${err.message}`);
        next();
    }
};

module.exports = cacheMiddleware;
