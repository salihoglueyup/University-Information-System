const mongoose = require('mongoose');
const meiliClient = require('../utils/meiliClient');
const logger = require('../utils/logger');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'academic', 'admin'],
        default: 'student'
    },
    fullName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    googleId: {
        type: String,
        sparse: true
    },
    twoFactorSecret: {
        type: String,
        required: false
    },
    isTwoFactorEnabled: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
}, { timestamps: true });

UserSchema.index({ role: 1 });
// email already has a unique+sparse index from its field definition above;
// declaring it again here caused a duplicate-index warning.

// Auto-Sync with Meilisearch
UserSchema.post('save', async function(doc) {
    if (doc.role === 'student') {
        try {
            const obj = { id: doc._id.toString(), username: doc.username, fullName: doc.fullName, email: doc.email };
            await meiliClient.index('students').addDocuments([obj]);
        } catch (err) { logger.error('Meili Index Error (User Save):', err.message); }
    }
});

UserSchema.post('findOneAndUpdate', async function(doc) {
    if (doc && doc.role === 'student') {
        try {
            const obj = { id: doc._id.toString(), username: doc.username, fullName: doc.fullName, email: doc.email };
            await meiliClient.index('students').addDocuments([obj]);
        } catch (err) { logger.error('Meili Index Error (User Update):', err.message); }
    }
});

UserSchema.post('findOneAndDelete', async function(doc) {
    if (doc && doc.role === 'student') {
        try { await meiliClient.index('students').deleteDocument(doc._id.toString()); }
        catch (err) { logger.error('Meili Index Error (User Delete):', err.message); }
    }
});

module.exports = mongoose.model('User', UserSchema);
