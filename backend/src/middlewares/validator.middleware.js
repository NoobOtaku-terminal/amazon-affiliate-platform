import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiHelpers.js';

/**
 * Validation middleware - checks express-validator results
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path || err.param,
            message: err.msg,
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: extractedErrors,
        });
    }

    next();
};

/**
 * Sanitize input data
 */
export const sanitizeInput = (req, res, next) => {
    // Remove any potentially harmful characters
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (typeof obj === 'object' && obj !== null) {
            const sanitized = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    sanitized[key] = sanitize(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    };

    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);

    next();
};
