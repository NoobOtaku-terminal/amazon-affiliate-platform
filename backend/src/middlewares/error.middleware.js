import logger from '../utils/logger.js';
import { ApiError } from '../utils/apiHelpers.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    let error = err;

    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
    });

    // Handle ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    // Handle Prisma errors
    if (err.code) {
        switch (err.code) {
            case 'P2002':
                error = new ApiError(409, `Duplicate field value: ${err.meta?.target}`);
                break;
            case 'P2014':
                error = new ApiError(400, 'Invalid ID');
                break;
            case 'P2003':
                error = new ApiError(400, 'Invalid reference');
                break;
            case 'P2025':
                error = new ApiError(404, 'Record not found');
                break;
            default:
                error = new ApiError(500, 'Database error');
        }
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new ApiError(401, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        error = new ApiError(401, 'Token expired');
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        error = new ApiError(400, 'Validation error', errors);
    }

    // Handle multer errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            error = new ApiError(400, 'File too large');
        } else {
            error = new ApiError(400, err.message);
        }
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * Not found handler
 */
export const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route not found - ${req.originalUrl}`);
    next(error);
};
