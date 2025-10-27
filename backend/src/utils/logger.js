import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '../config/index.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Console format with colors
const consoleFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
);

// File format without colors
const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
);

// Create logger instance
const logger = winston.createLogger({
    level: config.logging.level,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: consoleFormat,
        }),

        // Error log file
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
            maxSize: '20m',
            format: fileFormat,
        }),

        // Combined log file
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
            format: fileFormat,
        }),
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: 'logs/exceptions-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
            format: fileFormat,
        }),
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: 'logs/rejections-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
            format: fileFormat,
        }),
    ],
});

// In test environment, reduce logging
if (config.env === 'test') {
    logger.transports.forEach((t) => (t.silent = true));
}

export default logger;
