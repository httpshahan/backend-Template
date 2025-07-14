const sequelize = require('../config/database');

// Set up test environment
beforeAll(async () => {
  // Ensure test database is clean and synced
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Test database connected and synced');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', err => {
  console.error('Unhandled Promise Rejection in tests:', err);
  throw err;
});
