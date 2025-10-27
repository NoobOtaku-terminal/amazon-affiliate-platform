import reviewService from '../services/review.service.js';
import { successResponse, errorResponse } from '../utils/apiHelpers.js';
import logger from '../utils/logger.js';

class ReviewController {
    /**
     * Create a new review
     * POST /api/reviews
     */
    async createReview(req, res) {
        try {
            const review = await reviewService.createReview(req.user.userId, req.body);
            return successResponse(res, review, 'Review created successfully', 201);
        } catch (error) {
            logger.error('Create review error:', error);
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * Get review by ID
     * GET /api/reviews/:id
     */
    async getReview(req, res) {
        try {
            const review = await reviewService.getReviewById(req.params.id);
            return successResponse(res, review);
        } catch (error) {
            logger.error('Get review error:', error);
            return errorResponse(res, error.message, 404);
        }
    }

    /**
     * Get product reviews
     * GET /api/reviews/product
     */
    async getProductReviews(req, res) {
        try {
            const filters = {
                productId: req.query.productId,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                rating: req.query.rating,
                sortBy: req.query.sortBy || 'createdAt',
                sortOrder: req.query.sortOrder || 'desc',
            };

            const result = await reviewService.getProductReviews(filters);
            return successResponse(res, result);
        } catch (error) {
            logger.error('Get product reviews error:', error);
            return errorResponse(res, error.message, 500);
        }
    }

    /**
     * Get user's own reviews
     * GET /api/reviews/my-reviews
     */
    async getMyReviews(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
            };

            const result = await reviewService.getUserReviews(req.user.userId, filters);
            return successResponse(res, result);
        } catch (error) {
            logger.error('Get my reviews error:', error);
            return errorResponse(res, error.message, 500);
        }
    }

    /**
     * Update review
     * PUT /api/reviews/:id
     */
    async updateReview(req, res) {
        try {
            const review = await reviewService.updateReview(
                req.params.id,
                req.user.userId,
                req.body
            );
            return successResponse(res, review, 'Review updated successfully');
        } catch (error) {
            logger.error('Update review error:', error);
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * Delete review
     * DELETE /api/reviews/:id
     */
    async deleteReview(req, res) {
        try {
            const isAdmin = req.user.role === 'ADMIN';
            const result = await reviewService.deleteReview(
                req.params.id,
                req.user.userId,
                isAdmin
            );
            return successResponse(res, result, 'Review deleted successfully');
        } catch (error) {
            logger.error('Delete review error:', error);
            return errorResponse(res, error.message, 403);
        }
    }

    /**
     * Mark review as helpful
     * POST /api/reviews/:id/helpful
     */
    async markHelpful(req, res) {
        try {
            const review = await reviewService.markHelpful(req.params.id);
            return successResponse(res, review, 'Marked as helpful');
        } catch (error) {
            logger.error('Mark helpful error:', error);
            return errorResponse(res, error.message, 400);
        }
    }
}

export default new ReviewController();
