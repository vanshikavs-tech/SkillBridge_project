const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

/**
 * File Upload Middleware using Multer
 * 
 * Concept:
 * Uses memory storage or disk storage to process multipart/form-data.
 * Enforces file size limitations (max 5MB) and mime-type validation.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|pdf|doc|docx/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedExtensions.test(file.mimetype) || file.mimetype.includes('image') || file.mimetype.includes('pdf');

  if (extname || mimetype) {
    return cb(null, true);
  }
  cb(new ApiError(400, 'Only images and documents (jpg, png, webp, pdf, docx) are supported.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter,
});

module.exports = upload;
