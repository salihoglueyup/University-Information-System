const { MeiliSearch } = require('meilisearch');
const dotenv = require('dotenv');
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
        console.log('🔍 MeiliSearch Endeksleri başarıyla ayarlandı.');
    } catch (e) {
        console.warn('⚠️ MeiliSearch bağlantısı başarısız. Arama motoru pasif.', e.message);
    }
};

if (process.env.NODE_ENV !== 'test') {
    initIndexes();
}

module.exports = client;
