'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          first_name: 'System',
          last_name: 'Administrator',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin',
          is_active: true,
          email_verified: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: hashedPassword,
          role: 'user',
          is_active: true,
          email_verified: true,
          phone: '+1234567890',
          date_of_birth: '1990-01-15',
          address: '123 Main St, City, Country',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          password: hashedPassword,
          role: 'moderator',
          is_active: true,
          email_verified: true,
          phone: '+1234567891',
          date_of_birth: '1985-05-20',
          address: '456 Oak Ave, City, Country',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuidv4(),
          first_name: 'Bob',
          last_name: 'Wilson',
          email: 'bob.wilson@example.com',
          password: hashedPassword,
          role: 'user',
          is_active: false,
          email_verified: false,
          phone: '+1234567892',
          date_of_birth: '1995-08-10',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
