console.log('🔄 Starting server initialization...');

import app from './app.js';
console.log('✅ App module imported');

import config from './config/index.js';
console.log('✅ Config module imported');

import logger from './utils/logger.js';
console.log('✅ Logger module imported');

import prisma from './config/database.js';
console.log('✅ Database module imported');

import { initializeCronJobs } from './jobs/amazonSync.job.js';
console.log('✅ Cron jobs module imported');

const PORT = config.port;
console.log(`📍 Port configured: ${PORT}`);

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
    console.log('🔄 Starting server function...');

    console.log('🔄 Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connection completed');

    console.log('🔄 Initializing cron jobs...');
    initializeCronJobs();
    console.log('✅ Cron jobs initialized');

    console.log('🔄 Starting HTTP server...');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${config.env}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
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
