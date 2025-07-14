const sequelize = require('../config/database');
const User = require('./User');

// Import other models here
// const Product = require('./Product');
// const Order = require('./Order');

// Define associations here
// User.hasMany(Order, { foreignKey: 'userId' });
// Order.belongsTo(User, { foreignKey: 'userId' });

// Example of many-to-many relationship
// User.belongsToMany(Product, { through: 'UserProducts', foreignKey: 'userId' });
// Product.belongsToMany(User, { through: 'UserProducts', foreignKey: 'productId' });

const models = {
  User,
  sequelize
};

module.exports = models;
