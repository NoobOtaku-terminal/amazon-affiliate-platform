import cron from 'node-cron';
import prisma from '../config/database.js';
import amazonService from '../services/amazon.service.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

/**
 * Amazon Products and Deals Sync Job
 * Runs on schedule to update products, prices, and deals
 */

export const syncAmazonData = async () => {
    const startTime = Date.now();
    let syncLog;

    try {
        logger.info('🔄 Starting Amazon sync job...');

        // Create sync log entry
        syncLog = await prisma.syncLog.create({
            data: {
                jobType: 'PRODUCTS',
                status: 'RUNNING',
                startedAt: new Date(),
            },
        });

        let productsUpdated = 0;
        let productsCreated = 0;
        let productsFailed = 0;

        // Get all active products from database
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: { id: true, asin: true, price: true },
        });

        logger.info(`Found ${products.length} products to sync`);

        // Update each product
        for (const product of products) {
            try {
                // Fetch latest data from Amazon
                const amazonData = await amazonService.getProductByASIN(product.asin);

                if (amazonData) {
                    // Update product with new data
                    await prisma.product.update({
                        where: { id: product.id },
                        data: {
                            price: amazonData.price || product.price,
                            oldPrice: product.price !== amazonData.price ? product.price : undefined,
                            rating: amazonData.rating,
                            reviewCount: amazonData.reviewCount,
                            inStock: amazonData.inStock,
                            lastSyncedAt: new Date(),
                        },
                    });

                    // Check if price dropped (potential deal)
                    if (amazonData.price < product.price) {
                        const discountPercent = Math.round(((product.price - amazonData.price) / product.price) * 100);

                        if (discountPercent >= 10) {
                            // Create or update deal
                            await prisma.deal.upsert({
                                where: {
                                    productId: product.id,
                                },
                                update: {
                                    discountPercent,
                                    isActive: true,
                                },
                                create: {
                                    productId: product.id,
                                    title: `${discountPercent}% OFF`,
                                    discountPercent,
                                    startDate: new Date(),
                                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                                    isActive: true,
                                },
                            });

                            await prisma.product.update({
                                where: { id: product.id },
                                data: {
                                    isDeal: true,
                                    discountPercent,
                                    dealExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                                },
                            });
                        }
                    }

                    productsUpdated++;
                }
            } catch (error) {
                logger.error(`Failed to sync product ${product.asin}:`, error.message);
                productsFailed++;
            }

            // Add delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Fetch new deals from Amazon
        try {
            const amazonDeals = await amazonService.getDeals();
            // Process and create new products for deals
            // ... implementation
        } catch (error) {
            logger.error('Failed to fetch Amazon deals:', error);
        }

        // Update sync log
        const duration = Date.now() - startTime;
        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: 'SUCCESS',
                productsUpdated,
                productsCreated,
                productsFailed,
                duration,
                completedAt: new Date(),
                message: `Successfully synced ${productsUpdated} products`,
            },
        });

        logger.info(`✅ Amazon sync completed: ${productsUpdated} updated, ${productsCreated} created, ${productsFailed} failed`);
        logger.info(`⏱️  Duration: ${duration}ms`);

    } catch (error) {
        logger.error('❌ Amazon sync job failed:', error);

        if (syncLog) {
            await prisma.syncLog.update({
                where: { id: syncLog.id },
                data: {
                    status: 'FAILED',
                    message: error.message,
                    completedAt: new Date(),
                },
            });
        }
    }
};

/**
 * Cleanup expired deals
 */
export const cleanupExpiredDeals = async () => {
    try {
        logger.info('🧹 Cleaning up expired deals...');

        const result = await prisma.product.updateMany({
            where: {
                isDeal: true,
                dealExpiry: { lt: new Date() },
            },
            data: {
                isDeal: false,
                discountPercent: null,
                dealExpiry: null,
            },
        });

        await prisma.deal.updateMany({
            where: {
                isActive: true,
                endDate: { lt: new Date() },
            },
            data: { isActive: false },
        });

        logger.info(`✅ Cleaned up ${result.count} expired deals`);
    } catch (error) {
        logger.error('❌ Cleanup job failed:', error);
    }
};

/**
 * Initialize cron jobs
 */
export const initializeCronJobs = () => {
    // Sync products and deals every 6 hours
    cron.schedule(config.cron.syncSchedule, async () => {
        logger.info('⏰ Scheduled sync job triggered');
        await syncAmazonData();
    });

    // Cleanup expired deals daily
    cron.schedule(config.cron.cleanupSchedule, async () => {
        logger.info('⏰ Scheduled cleanup job triggered');
        await cleanupExpiredDeals();
    });

    logger.info('✅ Cron jobs initialized');
    logger.info(`📅 Sync schedule: ${config.cron.syncSchedule}`);
    logger.info(`📅 Cleanup schedule: ${config.cron.cleanupSchedule}`);
};
