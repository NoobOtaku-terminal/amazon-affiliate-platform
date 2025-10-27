import prisma from '../config/database.js';
import logger from '../utils/logger.js';

class DealService {
    /**
     * Create a new deal
     */
    async createDeal(dealData) {
        try {
            const { productId, dealPrice, dealPercentage, startDate, endDate, isActive = true } = dealData;

            // Check if product exists
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Calculate deal percentage if not provided
            let calculatedPercentage = dealPercentage;
            if (!calculatedPercentage && product.price) {
                calculatedPercentage = Math.round(((product.price - dealPrice) / product.price) * 100);
            }

            const deal = await prisma.deal.create({
                data: {
                    productId,
                    dealPrice,
                    dealPercentage: calculatedPercentage,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    isActive,
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            asin: true,
                            imageUrl: true,
                            price: true,
                            rating: true,
                        },
                    },
                },
            });

            logger.info(`Deal created: ${deal.id}`);
            return deal;
        } catch (error) {
            logger.error('Error creating deal:', error);
            throw error;
        }
    }

    /**
     * Get deal by ID
     */
    async getDealById(dealId) {
        try {
            const deal = await prisma.deal.findUnique({
                where: { id: dealId },
                include: {
                    product: {
                        include: {
                            category: true,
                            reviews: {
                                take: 5,
                                orderBy: { createdAt: 'desc' },
                            },
                        },
                    },
                },
            });

            if (!deal) {
                throw new Error('Deal not found');
            }

            return deal;
        } catch (error) {
            logger.error(`Error fetching deal ${dealId}:`, error);
            throw error;
        }
    }

    /**
     * Get all deals with filtering and pagination
     */
    async getDeals(filters = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                status = 'all',
                sortBy = 'dealPercentage',
                sortOrder = 'desc',
                categoryId,
            } = filters;

            const skip = (page - 1) * limit;
            const now = new Date();

            // Build where clause based on status
            let whereClause = {};

            if (status === 'active') {
                whereClause = {
                    isActive: true,
                    startDate: { lte: now },
                    endDate: { gte: now },
                };
            } else if (status === 'upcoming') {
                whereClause = {
                    isActive: true,
                    startDate: { gt: now },
                };
            } else if (status === 'expired') {
                whereClause = {
                    endDate: { lt: now },
                };
            }

            if (categoryId) {
                whereClause.product = {
                    categoryId,
                };
            }

            const [deals, total] = await Promise.all([
                prisma.deal.findMany({
                    where: whereClause,
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                asin: true,
                                imageUrl: true,
                                price: true,
                                rating: true,
                                reviewCount: true,
                                category: true,
                            },
                        },
                    },
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                }),
                prisma.deal.count({ where: whereClause }),
            ]);

            return {
                deals,
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
            logger.error('Error fetching deals:', error);
            throw error;
        }
    }

    /**
     * Get hot deals (highest discount percentage)
     */
    async getHotDeals(limit = 10) {
        try {
            const now = new Date();

            const deals = await prisma.deal.findMany({
                where: {
                    isActive: true,
                    startDate: { lte: now },
                    endDate: { gte: now },
                },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            asin: true,
                            imageUrl: true,
                            price: true,
                            rating: true,
                            reviewCount: true,
                        },
                    },
                },
                orderBy: { dealPercentage: 'desc' },
                take: limit,
            });

            return deals;
        } catch (error) {
            logger.error('Error fetching hot deals:', error);
            throw error;
        }
    }

    /**
     * Update deal
     */
    async updateDeal(dealId, updateData) {
        try {
            // Check if deal exists
            const existingDeal = await prisma.deal.findUnique({
                where: { id: dealId },
            });

            if (!existingDeal) {
                throw new Error('Deal not found');
            }

            const deal = await prisma.deal.update({
                where: { id: dealId },
                data: updateData,
                include: {
                    product: true,
                },
            });

            logger.info(`Deal updated: ${dealId}`);
            return deal;
        } catch (error) {
            logger.error(`Error updating deal ${dealId}:`, error);
            throw error;
        }
    }

    /**
     * Delete deal
     */
    async deleteDeal(dealId) {
        try {
            const deal = await prisma.deal.findUnique({
                where: { id: dealId },
            });

            if (!deal) {
                throw new Error('Deal not found');
            }

            await prisma.deal.delete({
                where: { id: dealId },
            });

            logger.info(`Deal deleted: ${dealId}`);
            return { message: 'Deal deleted successfully' };
        } catch (error) {
            logger.error(`Error deleting deal ${dealId}:`, error);
            throw error;
        }
    }

    /**
     * Deactivate expired deals (for cron job)
     */
    async deactivateExpiredDeals() {
        try {
            const now = new Date();

            const result = await prisma.deal.updateMany({
                where: {
                    isActive: true,
                    endDate: { lt: now },
                },
                data: {
                    isActive: false,
                },
            });

            logger.info(`Deactivated ${result.count} expired deals`);
            return result.count;
        } catch (error) {
            logger.error('Error deactivating expired deals:', error);
            throw error;
        }
    }
}

export default new DealService();
