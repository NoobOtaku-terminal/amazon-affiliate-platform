import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiHelpers.js';
import prisma from '../config/database.js';

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access token is required');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isEmailVerified: true,
            },
        });

        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

/**
 * Authorization middleware - checks user role
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};

/**
 * Optional authentication - does not fail if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isEmailVerified: true,
                },
            });

            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        // Silent fail - continue without user
    }

    next();
};
