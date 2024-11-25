import { initDatabase } from './src/utils/db.js';
import dotenv from 'dotenv';

// Configure WebAssembly memory
const wasmMemory = new WebAssembly.Memory({
  initial: 256,  // Initial memory in 64KB pages (16MB)
  maximum: 512   // Maximum memory in 64KB pages (32MB)
});

// Configure environment
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

// Export WebAssembly memory configuration
export const wasmConfig = {
  env: {
    memory: wasmMemory
  }
};

startApp().catch(console.error);

export default startApp;
