const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/s3');
const path = require('path');

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const folder = `tickets/${req.params.id || 'general'}`;
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, `${folder}/${filename}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.txt', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('File type not allowed'));
    },
});

module.exports = { upload };