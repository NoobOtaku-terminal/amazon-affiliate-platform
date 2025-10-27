import express from 'express';
import reviewController from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import {
    createReviewValidation,
    updateReviewValidation,
    getReviewValidation,
    getProductReviewsValidation,
    deleteReviewValidation,
    markHelpfulValidation,
} from '../validations/review.validation.js';

const router = express.Router();

/**
 * Public Routes
 */
// Get product reviews
router.get('/product', validate(getProductReviewsValidation), reviewController.getProductReviews);

// Get review by ID
router.get('/:id', validate(getReviewValidation), reviewController.getReview);

/**
 * Protected Routes (Authenticated Users)
 */
// Create review
router.post(
    '/',
    authenticate,
    validate(createReviewValidation),
    reviewController.createReview
);

// Get user's own reviews
router.get('/user/my-reviews', authenticate, reviewController.getMyReviews);

// Update review
router.put(
    '/:id',
    authenticate,
    validate(updateReviewValidation),
    reviewController.updateReview
);

// Delete review
router.delete(
    '/:id',
    authenticate,
    validate(deleteReviewValidation),
    reviewController.deleteReview
);

// Mark review as helpful
router.post(
    '/:id/helpful',
    validate(markHelpfulValidation),
    reviewController.markHelpful
);

export default router;
