import { body, query } from 'express-validator';

export const createProductValidation = [
  body('asin').trim().notEmpty().withMessage('ASIN is required'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 500 }),
  body('categoryId').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('affiliateUrl').trim().isURL().withMessage('Valid affiliate URL is required'),
  body('primaryImage').trim().isURL().withMessage('Valid image URL is required'),
];

export const updateProductValidation = [
  body('title').optional().trim().isLength({ min: 3, max: 500 }),
  body('price').optional().isFloat({ min: 0 }),
  body('categoryId').optional().trim().notEmpty(),
];

export const productQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minRating').optional().isFloat({ min: 0, max: 5 }),
  query('search').optional().trim(),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'rating', 'newest', 'popular']),
];
