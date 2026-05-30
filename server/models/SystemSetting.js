const mongoose = require('mongoose');

// University-wide system configuration (single global document).
const SystemSettingSchema = new mongoose.Schema({
    activeSemester: { type: String, default: '2023-2024 Güz' },
    registrationOpen: { type: Boolean, default: false },
    allowGradeEntry: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    systemVersion: { type: String, default: '1.0.0' },
    lastBackup: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', SystemSettingSchema);
