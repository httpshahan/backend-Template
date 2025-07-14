const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : 'Anonymous'
  });

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors.map(error => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Resource already exists';
    return res.status(409).json({
      success: false,
      message,
      errors: err.errors.map(error => ({
        field: error.path,
        message: `${error.path} already exists`
      }))
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Referenced resource does not exist';
    return res.status(400).json({
      success: false,
      message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Mongoose cast error (if using MongoDB in the future)
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message
    });
  }

  // Handle specific custom errors
  if (err.message === 'User not found' || err.message === 'Resource not found') {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === 'Invalid credentials' || err.message === 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === 'Forbidden' || err.message === 'Access denied') {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
