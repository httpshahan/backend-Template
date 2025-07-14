const User = require('../models/User');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class UserService {
  // Create a new user
  static async createUser(userData) {
    try {
      const user = await User.create(userData);
      logger.info(`User created: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error(`Error getting user by email ${email}:`, error);
      throw error;
    }
  }

  // Get all users with pagination
  static async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      const whereClause = search
        ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
        : {};

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      return {
        users: rows,
        totalUsers: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1
      };
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id, updateData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Don't allow updating certain fields
      const allowedFields = [
        'firstName',
        'lastName',
        'phone',
        'dateOfBirth',
        'address',
        'avatar',
        'isActive'
      ];

      const filteredData = {};
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      await user.update(filteredData);
      logger.info(`User updated: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  // Delete user (soft delete)
  static async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }

      await user.destroy(); // This will be a soft delete due to paranoid: true
      logger.info(`User deleted: ${user.email}`);
      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  // Change user password
  static async changePassword(id, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);
      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats() {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const inactiveUsers = await User.count({ where: { isActive: false } });
      const adminUsers = await User.count({ where: { role: 'admin' } });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersToday = await User.count({
        where: {
          createdAt: {
            [Op.gte]: today
          }
        }
      });

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        newUsersToday
      };
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }

  // Search users
  static async searchUsers(query, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } }
          ]
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      return {
        users: rows,
        totalUsers: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }
}

module.exports = UserService;
