const AuthService = require('../services/authService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class AuthController {
  // Register new user
  static async register(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

      const result = await AuthService.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully'
      });
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful'
      });
    } catch (error) {
      logger.error('Login error:', error);
      if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Logout user
  static async logout(req, res, next) {
    try {
      const userId = req.user.id;

      const result = await AuthService.logout(userId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }

  // Get user profile
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await AuthService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: { user },
        message: 'Profile retrieved successfully'
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  // Update user profile
  static async updateProfile(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const updateData = req.body;

      const user = await AuthService.updateProfile(userId, updateData);

      res.status(200).json({
        success: true,
        data: { user },
        message: 'Profile updated successfully'
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      next(error);
    }
  }

  // Change password
  static async changePassword(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      const result = await AuthService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Forgot password
  static async forgotPassword(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      const result = await AuthService.generatePasswordResetToken(email);

      // In a real application, you would send this token via email
      // For demo purposes, we're returning it in the response
      res.status(200).json({
        success: true,
        data: result,
        message: 'Password reset token generated. Check your email.'
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { resetToken, newPassword } = req.body;

      const result = await AuthService.resetPassword(resetToken, newPassword);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Password reset successful'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      if (error.message === 'Invalid or expired reset token') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required'
        });
      }

      const result = await AuthService.refreshToken(token);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      if (error.message === 'Invalid token' || error.message === 'User not found or inactive') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Verify email
  static async verifyEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const result = await AuthService.verifyEmail(verificationToken);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Email verified successfully'
      });
    } catch (error) {
      logger.error('Verify email error:', error);
      if (error.message === 'Invalid verification token') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = AuthController;
