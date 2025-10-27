import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import prisma from './config/database.js';
import { initializeCronJobs } from './jobs/amazonSync.job.js';

const PORT = config.port;

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await connectDatabase();

    // Initialize cron jobs
    initializeCronJobs();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${config.env}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
