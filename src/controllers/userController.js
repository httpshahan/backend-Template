const UserService = require('../services/userService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class UserController {
  // Get all users (admin only)
  static async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const result = await UserService.getAllUsers(page, limit, search);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      next(error);
    }
  }

  // Get user by ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await UserService.getUserById(id);

      res.status(200).json({
        success: true,
        data: { user },
        message: 'User retrieved successfully'
      });
    } catch (error) {
      logger.error('Get user by ID error:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Update user by ID (admin only)
  static async updateUser(req, res, next) {
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

      const { id } = req.params;
      const updateData = req.body;

      // Prevent users from updating their own role unless they're updating someone else
      if (req.user.id === id && updateData.role) {
        delete updateData.role;
      }

      const user = await UserService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        data: { user },
        message: 'User updated successfully'
      });
    } catch (error) {
      logger.error('Update user error:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Delete user by ID (admin only)
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Prevent users from deleting themselves
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot delete your own account'
        });
      }

      const result = await UserService.deleteUser(id);

      res.status(200).json({
        success: true,
        data: result,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Get user statistics (admin only)
  static async getUserStats(req, res, next) {
    try {
      const stats = await UserService.getUserStats();

      res.status(200).json({
        success: true,
        data: { stats },
        message: 'User statistics retrieved successfully'
      });
    } catch (error) {
      logger.error('Get user stats error:', error);
      next(error);
    }
  }

  // Search users
  static async searchUsers(req, res, next) {
    try {
      const { q: query, page = 1, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const result = await UserService.searchUsers(query, page, limit);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Search completed successfully'
      });
    } catch (error) {
      logger.error('Search users error:', error);
      next(error);
    }
  }

  // Activate/Deactivate user (admin only)
  static async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;

      // Prevent users from deactivating themselves
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own account'
        });
      }

      const user = await UserService.getUserById(id);
      const updatedUser = await UserService.updateUser(id, {
        isActive: !user.isActive
      });

      res.status(200).json({
        success: true,
        data: { user: updatedUser },
        message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      logger.error('Toggle user status error:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // Update user role (admin only)
  static async updateUserRole(req, res, next) {
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

      const { id } = req.params;
      const { role } = req.body;

      // Prevent users from updating their own role
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot update your own role'
        });
      }

      const user = await UserService.updateUser(id, { role });

      res.status(200).json({
        success: true,
        data: { user },
        message: 'User role updated successfully'
      });
    } catch (error) {
      logger.error('Update user role error:', error);
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = UserController;
