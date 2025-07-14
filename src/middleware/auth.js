const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Authentication middleware
const authMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    logger.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Moderator middleware (admin or moderator)
const moderatorMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Moderator access required'
      });
    }

    next();
  } catch (error) {
    logger.error('Moderator middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Optional auth middleware (for routes that work with or without auth)
const optionalAuthMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next(); // Continue without authentication
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without authentication
      logger.warn('Optional auth middleware - invalid token:', error.message);
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Role-based access control
const roleMiddleware = allowedRoles => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  moderatorMiddleware,
  optionalAuthMiddleware,
  roleMiddleware
};
