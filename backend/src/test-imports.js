// Simple test file to check what's causing the crash
console.log('Starting test...');

try {
    console.log('Testing config import...');
    const config = await import('./config/index.js');
    console.log('✅ Config imported successfully');

    console.log('Testing logger import...');
    const logger = await import('./utils/logger.js');
    console.log('✅ Logger imported successfully');

    console.log('Testing app import...');
    const app = await import('./app.js');
    console.log('✅ App imported successfully');

    console.log('Testing database import...');
    const database = await import('./config/database.js');
    console.log('✅ Database imported successfully');

    console.log('Testing cron jobs import...');
    const jobs = await import('./jobs/amazonSync.job.js');
    console.log('✅ Cron jobs imported successfully');

    console.log('All imports successful!');
} catch (error) {
    console.error('❌ Import failed:', error);
    console.error('Stack trace:', error.stack);
}