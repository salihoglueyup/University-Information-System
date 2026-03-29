const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const userId = req.user && req.user.id ? req.user.id : 'guest';
        cb(null, userId + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (e.g., only PDF, PNG, JPG)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Sadece PDF, JPG veya PNG formatlarına izin verilmektedir!'));
    }
};

// Configured Multer Instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 250 * 1024 * 1024 }, // 250 MB Limit
    fileFilter: fileFilter
});

module.exports = upload;
