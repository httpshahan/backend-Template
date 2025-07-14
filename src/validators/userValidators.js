const { body } = require('express-validator');

// Update user validation
const updateUserValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom(value => {
      if (!value) {
        return true;
      } // Skip validation if value is empty

      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        throw new Error('User must be at least 13 years old');
      }

      if (age > 120) {
        throw new Error('Please provide a valid date of birth');
      }

      return true;
    }),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value'),

  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Role must be one of: user, admin, moderator')
];

// Update user role validation
const updateUserRoleValidation = [
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Role must be one of: user, admin, moderator')
];

// Create user validation (for admin use)
const createUserValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),

  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Role must be one of: user, admin, moderator'),

  body('phone')
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)')
    .custom(value => {
      if (!value) {
        return true;
      }

      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13) {
        throw new Error('User must be at least 13 years old');
      }

      if (age > 120) {
        throw new Error('Please provide a valid date of birth');
      }

      return true;
    }),

  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value')
];

module.exports = {
  updateUserValidation,
  updateUserRoleValidation,
  createUserValidation
};
