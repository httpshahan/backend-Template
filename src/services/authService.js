const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const UserService = require('./userService');
const logger = require('../utils/logger');

class AuthService {
  // Generate JWT token
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    });
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Register new user
  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create user
      const user = await UserService.createUser(userData);

      // Generate token
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`User registered: ${user.email}`);

      return {
        user,
        token,
        message: 'User registered successfully'
      };
    } catch (error) {
      logger.error('Error in user registration:', error);
      throw error;
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Compare password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate token
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        user,
        token,
        message: 'Login successful'
      };
    } catch (error) {
      logger.error('Error in user login:', error);
      throw error;
    }
  }

  // Logout user (in a real app, you might want to blacklist the token)
  static async logout(userId) {
    try {
      // In a production app, you might want to:
      // 1. Add token to a blacklist
      // 2. Store logout time
      // 3. Clear refresh tokens

      logger.info(`User logged out: ${userId}`);
      return { message: 'Logout successful' };
    } catch (error) {
      logger.error('Error in user logout:', error);
      throw error;
    }
  }

  // Get user profile
  static async getProfile(userId) {
    try {
      const user = await UserService.getUserById(userId);
      return user;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const user = await UserService.updateUser(userId, updateData);
      logger.info(`Profile updated for user: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const result = await UserService.changePassword(userId, currentPassword, newPassword);
      return result;
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  // Generate password reset token
  static async generatePasswordResetToken(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save token to user
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetTokenExpiry;
      await user.save();

      logger.info(`Password reset token generated for: ${user.email}`);

      return {
        resetToken,
        message: 'Password reset token generated'
      };
    } catch (error) {
      logger.error('Error generating password reset token:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(resetToken, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          passwordResetToken: resetToken,
          passwordResetExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password and clear reset token
      user.password = newPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      logger.info(`Password reset for user: ${user.email}`);

      return { message: 'Password reset successful' };
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw error;
    }
  }

  // Verify email (for email verification feature)
  static async verifyEmail(verificationToken) {
    try {
      const user = await User.findOne({
        where: { emailVerificationToken: verificationToken }
      });

      if (!user) {
        throw new Error('Invalid verification token');
      }

      user.emailVerified = true;
      user.emailVerificationToken = null;
      await user.save();

      logger.info(`Email verified for user: ${user.email}`);

      return { message: 'Email verified successfully' };
    } catch (error) {
      logger.error('Error verifying email:', error);
      throw error;
    }
  }

  // Refresh token (for refresh token functionality)
  static async refreshToken(oldToken) {
    try {
      const decoded = this.verifyToken(oldToken);
      const user = await UserService.getUserById(decoded.id);

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const newToken = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return {
        token: newToken,
        user,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw error;
    }
  }
}

module.exports = AuthService;
