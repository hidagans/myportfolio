import { initDatabase } from './src/utils/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize database and start application
async function startApp() {
  try {
    // Initialize database tables
    await initDatabase();
    
    // Check environment variables
    const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingEnvVars.length > 0) {
      console.warn('⚠️  Missing environment variables:', missingEnvVars.join(', '));
      console.warn('Running in development mode with mock data');
      console.warn('Visit /install to configure the database for production');
    }

  } catch (error) {
    console.warn('⚠️ Database connection failed:', error.message);
    console.warn('Running in development mode with mock data');
    console.warn('Make sure your MySQL server is running and accessible');
  }
}

// Start the application
startApp().catch(console.error);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Performing graceful shutdown...');
  process.exit(0);
});

export default startApp;
