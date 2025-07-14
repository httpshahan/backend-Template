const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'backend_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  dialect: 'mysql',
  logging: msg => logger.debug(msg),
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true // Enables soft deletes
  },
  timezone: '+00:00' // UTC timezone
};

// Create Sequelize instance
const sequelize = new Sequelize(config);

// Test connection function (exported for testing)
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;
