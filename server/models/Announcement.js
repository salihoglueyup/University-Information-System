const mongoose = require('mongoose');
const meiliClient = require('../utils/meiliClient');

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['academic', 'administrative', 'events', 'genel', 'fakulte', 'ders'],
        default: 'genel'
    },
    priority: {
        type: String,
        enum: ['normal', 'high', 'urgent'],
        default: 'normal'
    },
    author: {
        type: String,
        default: 'Sistem Yöneticisi'
    }
}, { timestamps: true });

// Auto-Sync with Meilisearch
AnnouncementSchema.post('save', async function(doc) {
    try {
        const obj = { id: doc._id.toString(), title: doc.title, text: doc.text, category: doc.category };
        await meiliClient.index('announcements').addDocuments([obj]);
    } catch (err) { console.error('Meili Index Error (Announcement Save):', err.message); }
});

AnnouncementSchema.post('findOneAndUpdate', async function(doc) {
    if (doc) {
        try {
            const obj = { id: doc._id.toString(), title: doc.title, text: doc.text, category: doc.category };
            await meiliClient.index('announcements').addDocuments([obj]);
        } catch (err) { console.error('Meili Index Error (Announcement Update):', err.message); }
    }
});

AnnouncementSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try { await meiliClient.index('announcements').deleteDocument(doc._id.toString()); }
        catch (err) { console.error('Meili Index Error (Announcement Delete):', err.message); }
    }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
