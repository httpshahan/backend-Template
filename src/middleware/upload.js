const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const fs = require('fs').promises;
const config = require('../config/configLoader');

/**
 * File Upload Middleware using Multer
 * Supports image processing, file type validation, and size limits
 */

// Create upload directories if they don't exist
const createUploadDirs = async () => {
  const dirs = ['uploads', 'uploads/images', 'uploads/documents', 'uploads/temp'];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch (error) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// Initialize upload directories
createUploadDirs().catch(console.error);

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.upload?.allowedMimeTypes || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(', ')}`
      ),
      false
    );
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on file type
    const isImage = file.mimetype.startsWith('image/');
    const destination = isImage ? 'uploads/images' : 'uploads/documents';
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: uuid + timestamp + original extension
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.upload?.maxFileSize || 5 * 1024 * 1024, // Default 5MB
    files: config.upload?.maxFiles || 5 // Maximum number of files
  }
});

/**
 * Image processing middleware
 * Resizes and optimizes images after upload
 */
const processImage = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return next();
  }

  try {
    const { filename, path: filePath } = req.file;
    const outputPath = path.join('uploads/images', `processed-${filename}`);

    // Process image with Sharp
    await sharp(filePath)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Update file info
    req.file.processedPath = outputPath;
    req.file.processed = true;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * File validation middleware
 * Additional validation beyond multer's built-in checks
 */
const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Validate file extension matches MIME type
  const file = req.file || (req.files && req.files[0]);
  if (file) {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    const validExtensions = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    };

    if (validExtensions[mimeType] && !validExtensions[mimeType].includes(extension)) {
      return res.status(400).json({
        success: false,
        message: `File extension ${extension} does not match MIME type ${mimeType}`
      });
    }
  }

  next();
};

/**
 * Error handling middleware for multer
 */
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum size: ${(config.upload?.maxFileSize || 5242880) / 1024 / 1024}MB`
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: `Too many files. Maximum: ${config.upload?.maxFiles || 5} files`
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${error.message}`
        });
    }
  }

  if (error.message.includes('not allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

module.exports = {
  upload,
  processImage,
  validateFile,
  handleUploadError,
  createUploadDirs
};
