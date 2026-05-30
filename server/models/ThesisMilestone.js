const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
    id: { type: Number },
    title: { type: String, default: '' },
    date: { type: String, default: '' },
    status: { type: String, enum: ['Tamamlandı', 'Devam Ediyor', 'Bekliyor', 'Gecikmeli'], default: 'Bekliyor' },
    grade: { type: Number, default: null },
    feedback: { type: String, default: '' }
}, { _id: false });

// The milestone plan for a single thesis (keyed by the thesis-student id).
const ThesisMilestoneSchema = new mongoose.Schema({
    thesisId: { type: String, required: true, unique: true },
    student: { type: String, default: '' },
    project: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    milestones: { type: [MilestoneSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('ThesisMilestone', ThesisMilestoneSchema);
