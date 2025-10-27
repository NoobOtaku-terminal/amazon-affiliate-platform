import dotenv from 'dotenv';

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,

    database: {
        url: process.env.DATABASE_URL,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpire: process.env.JWT_EXPIRE || '1h',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    },

    amazon: {
        accessKey: process.env.AMAZON_ACCESS_KEY,
        secretKey: process.env.AMAZON_SECRET_KEY,
        partnerTag: process.env.AMAZON_PARTNER_TAG,
        region: process.env.AMAZON_REGION || 'us-east-1',
        host: process.env.AMAZON_HOST || 'webservices.amazon.com',
    },

    email: {
        smtp: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        },
        from: process.env.EMAIL_FROM || 'noreply@affiliate.com',
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        enabled: process.env.REDIS_ENABLED === 'true',
    },

    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },

    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
        uploadPath: process.env.UPLOAD_PATH || './uploads',
    },

    cron: {
        syncSchedule: process.env.SYNC_CRON_SCHEDULE || '0 */6 * * *', // Every 6 hours
        cleanupSchedule: process.env.CLEANUP_CRON_SCHEDULE || '0 0 * * *', // Daily at midnight
    },
};

// Validate critical configuration
const validateConfig = () => {
    const required = [
        'DATABASE_URL',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate JWT secret lengths
    if (process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    if (process.env.JWT_REFRESH_SECRET.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
    }
};

// Only validate in non-test environments
if (process.env.NODE_ENV !== 'test') {
    validateConfig();
}

export default config;
