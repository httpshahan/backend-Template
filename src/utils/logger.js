const winston = require('winston');
const path = require('path');
const config = require('../config/configLoader');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = config.get('logging.dir') || 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create logger instance
const logger = winston.createLogger({
  level: config.get('logging.level') || 'info',
  format: logFormat,
  defaultMeta: { service: 'backend-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      handleExceptions: true,
      maxsize: parseInt(config.get('logging.maxSize')?.replace('m', '')) * 1024 * 1024 || 5242880, // Default 5MB
      maxFiles: 5
    }),

    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],

  // Do not exit on handled exceptions
  exitOnError: false
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      ),
      handleExceptions: true
    })
  );
}

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(logDir, 'exceptions.log'),
    maxsize: 5242880,
    maxFiles: 5
  })
);

// Handle unhandled promise rejections
process.on('unhandledRejection', ex => {
  throw ex;
});

module.exports = logger;
