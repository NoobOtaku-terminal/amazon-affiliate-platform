import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for authentication routes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Moderate rate limiter for write operations
 */
export const writeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        success: false,
        message: 'Too many write operations, please slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Lenient rate limiter for read operations
 */
export const readLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        message: 'Too many requests, please try again shortly.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
