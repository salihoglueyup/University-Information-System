const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'error'],
        default: 'success'
    },
    ip: {
        type: String,
        default: '127.0.0.1'
    }
}, { timestamps: true });

LogSchema.index({ user: 1, createdAt: -1 });
LogSchema.index({ action: 1 });

module.exports = mongoose.model('Log', LogSchema);
