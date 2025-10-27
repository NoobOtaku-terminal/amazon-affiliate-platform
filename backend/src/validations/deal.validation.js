import { body, param, query } from 'express-validator';

export const createDealValidation = [
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .isUUID().withMessage('Invalid product ID format'),
    body('dealPrice')
        .notEmpty().withMessage('Deal price is required')
        .isFloat({ min: 0 }).withMessage('Deal price must be a positive number'),
    body('dealPercentage')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Deal percentage must be between 0 and 100'),
    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Invalid start date format'),
    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
];

export const updateDealValidation = [
    param('id')
        .notEmpty().withMessage('Deal ID is required')
        .isUUID().withMessage('Invalid deal ID format'),
    body('dealPrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('Deal price must be a positive number'),
    body('dealPercentage')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Deal percentage must be between 0 and 100'),
    body('startDate')
        .optional()
        .isISO8601().withMessage('Invalid start date format'),
    body('endDate')
        .optional()
        .isISO8601().withMessage('Invalid end date format'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
];

export const getDealValidation = [
    param('id')
        .notEmpty().withMessage('Deal ID is required')
        .isUUID().withMessage('Invalid deal ID format'),
];

export const getDealsValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status')
        .optional()
        .isIn(['active', 'upcoming', 'expired', 'all']).withMessage('Invalid status filter'),
    query('sortBy')
        .optional()
        .isIn(['dealPercentage', 'dealPrice', 'startDate', 'endDate', 'createdAt']).withMessage('Invalid sort field'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];

export const deleteDealValidation = [
    param('id')
        .notEmpty().withMessage('Deal ID is required')
        .isUUID().withMessage('Invalid deal ID format'),
];
