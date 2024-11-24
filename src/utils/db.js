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
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        port: process.env.DB_PORT || 3306,
        socketPath: process.env.DB_SOCKET
      });
    } catch (error) {
      console.error('Failed to create database pool:', error);
      return null;
    }
  }
  return pool;
}

// Initialize database tables
export async function initDatabase() {
  const pool = await getPool();
  if (!pool) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        link VARCHAR(255) NOT NULL,
        tags TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Admin functions
export async function getAdmin(username) {
  const pool = await getPool();
  if (!pool) return null;

  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  } catch (error) {
    console.error('Failed to get admin:', error);
    return null;
  }
}

export async function createAdmin(username, password) {
  const pool = await getPool();
  if (!pool) throw new Error('Database connection failed');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return result;
  } catch (error) {
    console.error('Failed to create admin:', error);
    throw error;
  }
}

// Project functions
export async function getProjects() {
  const pool = await getPool();
  if (!pool) return [];

  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
}

// Blog functions
export async function getBlogPosts() {
  const pool = await getPool();
  if (!pool) return [];

  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error('Failed to get blog posts:', error);
    return [];
  }
}
