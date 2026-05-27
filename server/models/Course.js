const mongoose = require('mongoose');
const meiliClient = require('../utils/meiliClient');
const logger = require('../utils/logger');

const CourseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        required: true
    },
    ects: {
        type: Number,
        required: true
    },
    type: { // 'Zorunlu', 'Seçmeli'
        type: String,
        default: 'Zorunlu'
    },
    instructor: {
        type: String,
        default: 'Atanmadı'
    },
    semester: {
        type: String,
        default: 'Güz'
    }
}, { timestamps: true });

CourseSchema.index({ instructor: 1 });
CourseSchema.index({ semester: 1, type: 1 });

// Auto-Sync with MeiliSearch
CourseSchema.post('save', async function(doc) {
    try {
        const obj = { id: doc._id.toString(), code: doc.code, title: doc.name, instructor: doc.instructor, credits: doc.credit };
        await meiliClient.index('courses').addDocuments([obj]);
    } catch(err) { logger.error('Meili Index Error (Course Save):', err.message) }
});

CourseSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        try {
            const obj = { id: doc._id.toString(), code: doc.code, title: doc.name, instructor: doc.instructor, credits: doc.credit };
            await meiliClient.index('courses').addDocuments([obj]);
        } catch(err) { logger.error('Meili Index Error (Course Update):', err.message) }
    }
});

CourseSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try { await meiliClient.index('courses').deleteDocument(doc._id.toString()); }
        catch(err) { logger.error('Meili Index Error (Course Delete):', err.message) }
    }
});

module.exports = mongoose.model('Course', CourseSchema);
