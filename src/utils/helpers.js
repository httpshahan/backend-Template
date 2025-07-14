/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errors - Detailed errors
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {array} data - Data array
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Success message
 */
const sendPaginatedResponse = (
  res,
  data,
  total,
  page,
  limit,
  message = 'Data retrieved successfully'
) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};

/**
 * Create API response object
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {object} data - Response data
 * @param {object} meta - Meta information
 */
const createResponse = (success = true, message = '', data = null, meta = null) => {
  const response = {
    success,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

/**
 * Handle async errors in route handlers
 * @param {function} fn - Async function
 */
const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Parse pagination parameters
 * @param {object} query - Request query object
 * @returns {object} Parsed pagination parameters
 */
const parsePagination = query => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  // Ensure reasonable limits
  const maxLimit = 100;
  const finalLimit = limit > maxLimit ? maxLimit : limit;

  return {
    page: page > 0 ? page : 1,
    limit: finalLimit,
    offset: offset >= 0 ? offset : 0
  };
};

/**
 * Parse sort parameters
 * @param {string} sortString - Sort string (e.g., 'name,-createdAt')
 * @returns {array} Sequelize order array
 */
const parseSort = sortString => {
  if (!sortString) {
    return [['createdAt', 'DESC']]; // Default sort
  }

  const sortFields = sortString.split(',');
  const order = [];

  sortFields.forEach(field => {
    const trimmedField = field.trim();
    if (trimmedField.startsWith('-')) {
      // Descending order
      order.push([trimmedField.substring(1), 'DESC']);
    } else {
      // Ascending order
      order.push([trimmedField, 'ASC']);
    }
  });

  return order.length > 0 ? order : [['createdAt', 'DESC']];
};

/**
 * Filter sensitive data from user object
 * @param {object} user - User object
 * @returns {object} Filtered user object
 */
const filterUserData = user => {
  if (!user) {
    return null;
  }

  const userData = user.toJSON ? user.toJSON() : user;

  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'emailVerificationToken',
    'passwordResetToken',
    'passwordResetExpires'
  ];

  sensitiveFields.forEach(field => {
    delete userData[field];
  });

  return userData;
};

/**
 * Generate cache key
 * @param {string} prefix - Cache key prefix
 * @param {string|object} identifier - Unique identifier
 * @returns {string} Cache key
 */
const generateCacheKey = (prefix, identifier) => {
  const id = typeof identifier === 'object' ? JSON.stringify(identifier) : identifier;
  return `${prefix}:${id}`;
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Validation result
 */
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} Validation result
 */
const isValidPhone = phone => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate slug from text
 * @param {string} text - Text to convert
 * @returns {string} Slug
 */
const generateSlug = text => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Calculate age from date of birth
 * @param {Date|string} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
const calculateAge = dateOfBirth => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
  createResponse,
  asyncHandler,
  parsePagination,
  parseSort,
  filterUserData,
  generateCacheKey,
  isValidEmail,
  isValidPhone,
  generateSlug,
  calculateAge
};
