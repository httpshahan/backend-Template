const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const { upload, processImage, validateFile, handleUploadError } = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');

/**
 * Upload Routes
 * Handles file uploads with authentication and validation
 */

/**
 * @route   POST /api/v1/upload/single
 * @desc    Upload a single file
 * @access  Private (requires authentication)
 */
router.post(
  '/single',
  authMiddleware,
  upload.single('file'),
  validateFile,
  processImage,
  async(req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // File information to return
      const fileInfo = {
        id: file.filename.split('-')[0], // UUID part
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/uploads/${file.mimetype.startsWith('image/') ? 'images' : 'documents'}/${file.filename}`,
        uploadedAt: new Date(),
        uploadedBy: req.user.id
      };

      // If image was processed, update the info
      if (file.processed) {
        fileInfo.processedPath = file.processedPath;
        fileInfo.processedUrl = `/uploads/images/processed-${file.filename}`;
      }

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          file: fileInfo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during file upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/v1/upload/multiple
 * @desc    Upload multiple files (max 5)
 * @access  Private (requires authentication)
 */
router.post(
  '/multiple',
  authMiddleware,
  upload.array('files', 5),
  validateFile,
  async(req, res) => {
    try {
      const files = req.files;

      if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: Array.isArray(files) ? 'No files uploaded' : 'Invalid files parameter'
        });
      }

      // Process each file
      const fileInfos = await Promise.all(
        files.map(async file => {
          // Process image if it's an image
          if (file.mimetype.startsWith('image/')) {
            try {
              await processImage({ file }, {}, () => {});
            } catch (error) {
              // Image processing failed, continue without processing
            }
          }

          return {
            id: file.filename.split('-')[0],
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            url: `/uploads/${file.mimetype.startsWith('image/') ? 'images' : 'documents'}/${file.filename}`,
            uploadedAt: new Date(),
            uploadedBy: req.user.id,
            processed: file.processed || false,
            processedUrl: file.processed ? `/uploads/images/processed-${file.filename}` : undefined
          };
        })
      );

      res.status(201).json({
        success: true,
        message: `${files.length} files uploaded successfully`,
        data: {
          files: fileInfos,
          count: files.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during file upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   GET /api/v1/upload/file/:filename
 * @desc    Serve uploaded files
 * @access  Public (files are served directly)
 */
router.get('/file/:filename', async(req, res) => {
  try {
    const { filename } = req.params;

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Try to find file in images or documents directory
    const imagePath = path.join('uploads/images', filename);
    const docPath = path.join('uploads/documents', filename);

    let filePath;
    let contentType;

    try {
      await fs.access(imagePath);
      filePath = imagePath;
      contentType = 'image/*';
    } catch {
      try {
        await fs.access(docPath);
        filePath = docPath;
        contentType = 'application/octet-stream';
      } catch {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while serving file'
    });
  }
});

/**
 * @route   DELETE /api/v1/upload/file/:filename
 * @desc    Delete an uploaded file
 * @access  Private (requires authentication)
 */
router.delete('/file/:filename', authMiddleware, async(req, res) => {
  try {
    const { filename } = req.params;

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Try to find and delete file
    const imagePath = path.join('uploads/images', filename);
    const docPath = path.join('uploads/documents', filename);
    const processedPath = path.join('uploads/images', `processed-${filename}`);

    let deleted = false;

    // Delete original file
    for (const filePath of [imagePath, docPath]) {
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        deleted = true;
        break;
      } catch {
        // File doesn't exist in this location, try next
      }
    }

    // Delete processed version if it exists
    try {
      await fs.access(processedPath);
      await fs.unlink(processedPath);
    } catch {
      // Processed file doesn't exist, that's okay
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting file'
    });
  }
});

/**
 * @route   GET /api/v1/upload/info
 * @desc    Get upload configuration info
 * @access  Public
 */
router.get('/info', (req, res) => {
  const config = require('../config/configLoader');

  res.json({
    success: true,
    data: {
      maxFileSize: config.upload?.maxFileSize || 5242880,
      maxFileSizeMB: (config.upload?.maxFileSize || 5242880) / 1024 / 1024,
      maxFiles: config.upload?.maxFiles || 5,
      allowedMimeTypes: config.upload?.allowedMimeTypes || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx']
    }
  });
});

// Error handling middleware
router.use(handleUploadError);

module.exports = router;
