import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

let pool;

// Create connection pool with lazy initialization
async function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1', // Changed from localhost to 127.0.0.1
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        port: process.env.DB_PORT || 3306,
        socketPath: process.env.DB_SOCKET // Add socket path support for cPanel
      });

      // Test connection
      await pool.getConnection();
    } catch (error) {
      console.error('Failed to create database pool:', error);
      return null;
    }
  }
  return pool;
}

// Rest of the file remains the same...
