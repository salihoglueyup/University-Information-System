const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

const ItemSchema = new mongoose.Schema({
    id: { type: Number },
    description: { type: String, default: '' },
    points: { type: Number, default: 0 },
    maxPoints: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
}, { _id: false });

const CategorySchema = new mongoose.Schema({
    id: { type: Number },
    title: { type: String, default: '' },
    items: { type: [ItemSchema], default: [] }
}, { _id: false });

const ExtraPointSchema = new mongoose.Schema({
    id: { type: Number },
    category: { type: String, default: '' },
    officer: { type: String, default: '' },
    date: { type: String, default: '' },
    points: { type: Number, default: 0 }
}, { _id: false });

// A student's "social transcript" (co-curricular points), one per user.
const SocialTranscriptSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    requiredPoints: { type: Number, default: 100 },
    badges: { type: [BadgeSchema], default: [] },
    categories: { type: [CategorySchema], default: [] },
    extraPoints: { type: [ExtraPointSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('SocialTranscript', SocialTranscriptSchema);
