const searchService = require('../services/searchService');

class SearchController {
    async search(req, res, next) {
        try {
            const query = req.query.q || '';
            if (!query) {
                return res.status(200).json({ students: [], announcements: [], courses: [] });
            }
            const results = await searchService.globalSearch(query);
            res.status(200).json(results);
        } catch (err) {
            next(err);
        }
    }

    async syncData(req, res, next) {
        try {
            await searchService.syncAllData();
            res.status(200).json({ status: 'success', message: 'Veritabanı indeksi MeiliSearch ile eşitlendi.' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SearchController();
