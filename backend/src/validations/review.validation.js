import { body, param, query } from 'express-validator';

export const createReviewValidation = [
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .isUUID().withMessage('Invalid product ID format'),
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title')
        .notEmpty().withMessage('Review title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('comment')
        .notEmpty().withMessage('Review comment is required')
        .isLength({ min: 20, max: 2000 }).withMessage('Comment must be between 20 and 2000 characters'),
    body('pros')
        .optional()
        .isArray().withMessage('Pros must be an array'),
    body('cons')
        .optional()
        .isArray().withMessage('Cons must be an array'),
];

export const updateReviewValidation = [
    param('id')
        .notEmpty().withMessage('Review ID is required')
        .isUUID().withMessage('Invalid review ID format'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title')
        .optional()
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('comment')
        .optional()
        .isLength({ min: 20, max: 2000 }).withMessage('Comment must be between 20 and 2000 characters'),
];

export const getReviewValidation = [
    param('id')
        .notEmpty().withMessage('Review ID is required')
        .isUUID().withMessage('Invalid review ID format'),
];

export const getProductReviewsValidation = [
    query('productId')
        .notEmpty().withMessage('Product ID is required')
        .isUUID().withMessage('Invalid product ID format'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating filter must be between 1 and 5'),
    query('sortBy')
        .optional()
        .isIn(['rating', 'helpful', 'createdAt']).withMessage('Invalid sort field'),
];

export const deleteReviewValidation = [
    param('id')
        .notEmpty().withMessage('Review ID is required')
        .isUUID().withMessage('Invalid review ID format'),
];

export const markHelpfulValidation = [
    param('id')
        .notEmpty().withMessage('Review ID is required')
        .isUUID().withMessage('Invalid review ID format'),
];
