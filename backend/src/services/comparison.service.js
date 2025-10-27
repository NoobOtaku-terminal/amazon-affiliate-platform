import prisma from '../config/database.js';
import logger from '../utils/logger.js';

class ComparisonService {
    /**
     * Create a new comparison
     */
    async createComparison(userId, productIds) {
        try {
            if (productIds.length < 2) {
                throw new Error('At least 2 products are required for comparison');
            }

            if (productIds.length > 4) {
                throw new Error('Maximum 4 products can be compared at once');
            }

            // Verify all products exist
            const products = await prisma.product.findMany({
                where: {
                    id: { in: productIds },
                },
            });

            if (products.length !== productIds.length) {
                throw new Error('One or more products not found');
            }

            const comparison = await prisma.comparison.create({
                data: {
                    userId,
                    comparisonProducts: {
                        create: productIds.map((productId, index) => ({
                            productId,
                            position: index,
                        })),
                    },
                },
                include: {
                    comparisonProducts: {
                        include: {
                            product: {
                                include: {
                                    category: true,
                                    deals: {
                                        where: {
                                            isActive: true,
                                            startDate: { lte: new Date() },
                                            endDate: { gte: new Date() },
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: { position: 'asc' },
                    },
                },
            });

            logger.info(`Comparison created: ${comparison.id}`);
            return comparison;
        } catch (error) {
            logger.error('Error creating comparison:', error);
            throw error;
        }
    }

    /**
     * Get comparison by ID
     */
    async getComparisonById(comparisonId) {
        try {
            const comparison = await prisma.comparison.findUnique({
                where: { id: comparisonId },
                include: {
                    comparisonProducts: {
                        include: {
                            product: {
                                include: {
                                    category: true,
                                    deals: {
                                        where: {
                                            isActive: true,
                                            startDate: { lte: new Date() },
                                            endDate: { gte: new Date() },
                                        },
                                    },
                                    reviews: {
                                        take: 3,
                                        orderBy: { rating: 'desc' },
                                    },
                                },
                            },
                        },
                        orderBy: { position: 'asc' },
                    },
                },
            });

            if (!comparison) {
                throw new Error('Comparison not found');
            }

            return comparison;
        } catch (error) {
            logger.error(`Error fetching comparison ${comparisonId}:`, error);
            throw error;
        }
    }

    /**
     * Get user comparisons
     */
    async getUserComparisons(userId, filters = {}) {
        try {
            const { page = 1, limit = 20 } = filters;
            const skip = (page - 1) * limit;

            const [comparisons, total] = await Promise.all([
                prisma.comparison.findMany({
                    where: { userId },
                    include: {
                        comparisonProducts: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                        imageUrl: true,
                                        price: true,
                                        rating: true,
                                    },
                                },
                            },
                            orderBy: { position: 'asc' },
                        },
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.comparison.count({ where: { userId } }),
            ]);

            return {
                comparisons,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Error fetching user comparisons:', error);
            throw error;
        }
    }

    /**
     * Delete comparison
     */
    async deleteComparison(comparisonId, userId) {
        try {
            const comparison = await prisma.comparison.findUnique({
                where: { id: comparisonId },
            });

            if (!comparison) {
                throw new Error('Comparison not found');
            }

            if (comparison.userId !== userId) {
                throw new Error('Not authorized to delete this comparison');
            }

            await prisma.comparison.delete({
                where: { id: comparisonId },
            });

            logger.info(`Comparison deleted: ${comparisonId}`);
            return { message: 'Comparison deleted successfully' };
        } catch (error) {
            logger.error(`Error deleting comparison ${comparisonId}:`, error);
            throw error;
        }
    }
}

class SavedProductService {
    /**
     * Save a product
     */
    async saveProduct(userId, productId) {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            const existing = await prisma.savedProduct.findFirst({
                where: { userId, productId },
            });

            if (existing) {
                throw new Error('Product already saved');
            }

            const saved = await prisma.savedProduct.create({
                data: { userId, productId },
                include: {
                    product: {
                        include: {
                            category: true,
                            deals: {
                                where: {
                                    isActive: true,
                                    startDate: { lte: new Date() },
                                    endDate: { gte: new Date() },
                                },
                            },
                        },
                    },
                },
            });

            logger.info(`Product saved: ${productId} by user ${userId}`);
            return saved;
        } catch (error) {
            logger.error('Error saving product:', error);
            throw error;
        }
    }

    /**
     * Get saved products
     */
    async getSavedProducts(userId, filters = {}) {
        try {
            const { page = 1, limit = 20 } = filters;
            const skip = (page - 1) * limit;

            const [savedProducts, total] = await Promise.all([
                prisma.savedProduct.findMany({
                    where: { userId },
                    include: {
                        product: {
                            include: {
                                category: true,
                                deals: {
                                    where: {
                                        isActive: true,
                                        startDate: { lte: new Date() },
                                        endDate: { gte: new Date() },
                                    },
                                },
                            },
                        },
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.savedProduct.count({ where: { userId } }),
            ]);

            return {
                savedProducts,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('Error fetching saved products:', error);
            throw error;
        }
    }

    /**
     * Remove saved product
     */
    async removeSavedProduct(userId, productId) {
        try {
            const saved = await prisma.savedProduct.findFirst({
                where: { userId, productId },
            });

            if (!saved) {
                throw new Error('Saved product not found');
            }

            await prisma.savedProduct.delete({
                where: { id: saved.id },
            });

            logger.info(`Product unsaved: ${productId} by user ${userId}`);
            return { message: 'Product removed from saved list' };
        } catch (error) {
            logger.error('Error removing saved product:', error);
            throw error;
        }
    }

    /**
     * Check if product is saved
     */
    async isProductSaved(userId, productId) {
        try {
            const saved = await prisma.savedProduct.findFirst({
                where: { userId, productId },
            });

            return { isSaved: !!saved };
        } catch (error) {
            logger.error('Error checking saved product:', error);
            throw error;
        }
    }
}

export const comparisonService = new ComparisonService();
export const savedProductService = new SavedProductService();
