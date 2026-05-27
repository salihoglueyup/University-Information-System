const { MeiliSearch } = require('meilisearch');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();

const meiliConfig = {
    host: process.env.MEILI_HOST || 'http://localhost:7700',
};

if (process.env.MEILI_MASTER_KEY) {
    meiliConfig.apiKey = process.env.MEILI_MASTER_KEY;
}

const client = new MeiliSearch(meiliConfig);

// Helper function to initialize indexes on startup
const initIndexes = async () => {
    try {
        await client.index('students').updateSettings({
            searchableAttributes: ['fullName', 'username', 'department', 'faculty'],
            filterableAttributes: ['role', 'department']
        });
        await client.index('announcements').updateSettings({
            searchableAttributes: ['title', 'text', 'category'],
            filterableAttributes: ['category']
        });
        await client.index('courses').updateSettings({
            searchableAttributes: ['code', 'title', 'instructor'],
            filterableAttributes: ['credits']
        });
        logger.info('MeiliSearch indexes configured successfully.');
    } catch (e) {
        logger.warn(`MeiliSearch connection failed. Search engine disabled. Details: ${e.message}`);
    }
};

if (process.env.NODE_ENV !== 'test') {
    initIndexes();
}

module.exports = client;
