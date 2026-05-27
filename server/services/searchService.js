const meiliClient = require('../utils/meiliClient');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Course = require('../models/Course');
const logger = require('../utils/logger');

class SearchService {
    async globalSearch(query) {
        try {
            // Perform parallel searches across multiple indexes
            const [studentResults, announcementResults, courseResults] = await Promise.all([
                meiliClient.index('students').search(query, { limit: 5 }),
                meiliClient.index('announcements').search(query, { limit: 5 }),
                meiliClient.index('courses').search(query, { limit: 5 })
            ]);

            return {
                students: studentResults.hits,
                announcements: announcementResults.hits,
                courses: courseResults.hits
            };
        } catch (error) {
            logger.error('Search Engine Error:', error);
            return { students: [], announcements: [], courses: [] }; // Fallback
        }
    }

    async syncAllData() {
        try {
            logger.info('Indexing data to MeiliSearch...');

            // Sync Students
            const students = await User.find({ role: 'student' }).select('fullName username email department faculty').lean();
            if (students.length > 0) {
                const formattedStudents = students.map(s => ({ ...s, id: s._id.toString() }));
                await meiliClient.index('students').addDocuments(formattedStudents);
            }

            // Sync Announcements
            const announcements = await Announcement.find().lean();
            if (announcements.length > 0) {
                const formattedAnn = announcements.map(a => ({ ...a, id: a._id.toString() }));
                await meiliClient.index('announcements').addDocuments(formattedAnn);
            }

            // Sync Courses
            const courses = await Course.find().lean();
            if (courses.length > 0) {
                const formattedCourses = courses.map(c => ({ ...c, id: c._id.toString() }));
                await meiliClient.index('courses').addDocuments(formattedCourses);
            }

            logger.info('Indexing completed!');
        } catch (error) {
            logger.error('Migration Error to MeiliSearch:', error.message);
            throw error;
        }
    }
}

module.exports = new SearchService();
