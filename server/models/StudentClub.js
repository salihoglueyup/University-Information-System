const mongoose = require('mongoose');

// A student club (global catalog) members can join.
const StudentClubSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '🎓' },
    members: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    memberUserIds: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('StudentClub', StudentClubSchema);
