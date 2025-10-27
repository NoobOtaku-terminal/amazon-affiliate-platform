import prisma from '../config/database.js';
import logger from '../utils/logger.js';

class ReviewService {
    /**
     * Create a new review
     */
    async createReview(userId, reviewData) {
        try {
            const { productId, rating, title, comment, pros = [], cons = [] } = reviewData;

            // Check if product exists
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Check if user already reviewed this product
            const existingReview = await prisma.review.findFirst({
                where: {
                    userId,
                    productId,
                },
            });

            if (existingReview) {
                throw new Error('You have already reviewed this product');
            }

            // Create review
            const review = await prisma.review.create({
                data: {
                    userId,
                    productId,
                    rating,
                    title,
                    comment,
                    pros,
                    cons,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            asin: true,
                        },
                    },
                },
            });

            // Update product rating
            await this.updateProductRating(productId);

            logger.info(`Review created: ${review.id}`);
            return review;
        } catch (error) {
            logger.error('Error creating review:', error);
            throw error;
        }
    }

    /**
     * Get review by ID
     */
    async getReviewById(reviewId) {
        try {
            const review = await prisma.review.findUnique({
                where: { id: reviewId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            asin: true,
                            imageUrl: true,
                        },
                    },
                },
            });

            if (!review) {
                throw new Error('Review not found');
            }

            return review;
        } catch (error) {
            logger.error(`Error fetching review ${reviewId}:`, error);
            throw error;
        }
    }

    /**
     * Get reviews for a product
     */
    async getProductReviews(filters = {}) {
        try {
            const {
                productId,
                page = 1,
                limit = 20,
                rating,
                sortBy = 'createdAt',
                sortOrder = 'desc',
            } = filters;

            const skip = (page - 1) * limit;

            let whereClause = { productId };

            if (rating) {
                whereClause.rating = parseInt(rating);
            }

            const orderBy = {};
            if (sortBy === 'helpful') {
                orderBy.helpfulCount = sortOrder;
            } else {
                orderBy[sortBy] = sortOrder;
            }

            const [reviews, total, ratingStats] = await Promise.all([
                prisma.review.findMany({
                    where: whereClause,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    skip,
                    take: limit,
                    orderBy,
                }),
                prisma.review.count({ where: whereClause }),
                this.getRatingStats(productId),
            ]);

            return {
                reviews,
                ratingStats,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1,
                },
            };
        } catch (error) {
            logger.error('Error fetching product reviews:', error);
            throw error;
        }
    }

    /**
     * Get rating statistics for a product
     */
    async getRatingStats(productId) {
        try {
            const reviews = await prisma.review.findMany({
                where: { productId },
                select: { rating: true },
            });

            const totalReviews = reviews.length;
            if (totalReviews === 0) {
                return {
                    average: 0,
                    total: 0,
                    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                };
            }

            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let sum = 0;

            reviews.forEach((review) => {
                distribution[review.rating]++;
                sum += review.rating;
            });

            return {
                average: (sum / totalReviews).toFixed(2),
                total: totalReviews,
                distribution,
            };
        } catch (error) {
            logger.error('Error calculating rating stats:', error);
            throw error;
        }
    }

    /**
     * Get user reviews
     */
    async getUserReviews(userId, filters = {}) {
        try {
            const { page = 1, limit = 20 } = filters;
            const skip = (page - 1) * limit;

            const [reviews, total] = await Promise.all([
                prisma.review.findMany({
                    where: { userId },
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                asin: true,
                                imageUrl: true,
                                price: true,
                            },
                        },
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.review.count({ where: { userId } }),
            ]);

            return {
                reviews,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Error fetching user reviews:', error);
            throw error;
        }
    }

    /**
     * Update review
     */
    async updateReview(reviewId, userId, updateData) {
        try {
            const existingReview = await prisma.review.findUnique({
                where: { id: reviewId },
            });

            if (!existingReview) {
                throw new Error('Review not found');
            }

            // Check ownership
            if (existingReview.userId !== userId) {
                throw new Error('Not authorized to update this review');
            }

            const review = await prisma.review.update({
                where: { id: reviewId },
                data: updateData,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    product: true,
                },
            });

            // Update product rating if rating changed
            if (updateData.rating) {
                await this.updateProductRating(existingReview.productId);
            }

            logger.info(`Review updated: ${reviewId}`);
            return review;
        } catch (error) {
            logger.error(`Error updating review ${reviewId}:`, error);
            throw error;
        }
    }

    /**
     * Delete review
     */
    async deleteReview(reviewId, userId, isAdmin = false) {
        try {
            const review = await prisma.review.findUnique({
                where: { id: reviewId },
            });

            if (!review) {
                throw new Error('Review not found');
            }

            // Check ownership (unless admin)
            if (!isAdmin && review.userId !== userId) {
                throw new Error('Not authorized to delete this review');
            }

            const productId = review.productId;

            await prisma.review.delete({
                where: { id: reviewId },
            });

            // Update product rating
            await this.updateProductRating(productId);

            logger.info(`Review deleted: ${reviewId}`);
            return { message: 'Review deleted successfully' };
        } catch (error) {
            logger.error(`Error deleting review ${reviewId}:`, error);
            throw error;
        }
    }

    /**
     * Mark review as helpful
     */
    async markHelpful(reviewId) {
        try {
            const review = await prisma.review.update({
                where: { id: reviewId },
                data: {
                    helpfulCount: { increment: 1 },
                },
            });

            return review;
        } catch (error) {
            logger.error(`Error marking review ${reviewId} as helpful:`, error);
            throw error;
        }
    }

    /**
     * Update product rating (helper function)
     */
    async updateProductRating(productId) {
        try {
            const reviews = await prisma.review.findMany({
                where: { productId },
                select: { rating: true },
            });

            if (reviews.length === 0) {
                await prisma.product.update({
                    where: { id: productId },
                    data: {
                        rating: 0,
                        reviewCount: 0,
                    },
                });
                return;
            }

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;

            await prisma.product.update({
                where: { id: productId },
                data: {
                    rating: parseFloat(averageRating.toFixed(2)),
                    reviewCount: reviews.length,
                },
            });
        } catch (error) {
            logger.error('Error updating product rating:', error);
            // Don't throw - this is a helper function
        }
    }
}

export default new ReviewService();
