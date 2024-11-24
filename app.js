import { initDatabase } from './src/utils/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function startApp() {
  try {
    await initDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.warn('⚠️ Database initialization failed:', error.message);
    console.warn('Running in development mode without database');
  }
}

startApp().catch(console.error);

export default startApp;
