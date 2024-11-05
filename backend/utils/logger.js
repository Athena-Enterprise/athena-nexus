// backend/utils/logger.js

const { createLogger, format, transports } = require('winston');
const path = require('path');
require('winston-daily-rotate-file'); // Only if using daily rotate file transport

const { combine, timestamp, printf, colorize } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport with colorized output
    new transports.Console({
      format: combine(
        colorize(),
        logFormat
      ),
    }),
    
    // File transport for all logs
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      level: 'info',
    }),
    
    // File transport for error logs
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    
    // (Optional) Daily Rotate File transport
    /*
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/%DATE%-combined.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    */
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(__dirname, '../logs/rejections.log') })
  ]
});

// If in development, log all levels to console with color
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      logFormat
    )
  }));
}

module.exports = logger;
