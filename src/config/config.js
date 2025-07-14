const config = require('./configLoader');

// Sequelize configuration - exported in the format Sequelize expects
module.exports = {
  development: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.name'),
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: config.get('database.dialect'),
    pool: config.get('database.pool'),
    define: config.get('database.define'),
    logging: config.get('database.logging')
  },
  test: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.name'),
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: config.get('database.dialect'),
    pool: config.get('database.pool'),
    define: config.get('database.define'),
    logging: config.get('database.logging')
  },
  production: {
    username: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.name'),
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: config.get('database.dialect'),
    pool: config.get('database.pool'),
    define: config.get('database.define'),
    logging: config.get('database.logging')
  }
};
