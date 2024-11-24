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
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
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
  try {
    const pool = await getPool();
    if (!pool) {
      console.warn('⚠️ Database connection not available. Running in development mode.');
      return;
    }

    const connection = await pool.getConnection();
    try {
      await connection.query(`
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

      await connection.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          image VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.warn('⚠️ Database initialization failed:', error.message);
    console.warn('Running in development mode without database.');
  }
}

// Mock data for development
const mockProjects = [
  {
    id: 1,
    title: 'Example Project',
    description: 'This is a sample project for development.',
    image: 'placeholder.jpg',
    link: 'https://example.com',
    tags: 'React,TypeScript,Tailwind',
    created_at: new Date().toISOString()
  }
];

const mockPosts = [
  {
    id: 1,
    title: 'Example Blog Post',
    content: 'This is a sample blog post for development.',
    image: 'placeholder.jpg',
    created_at: new Date().toISOString()
  }
];

// Project functions with fallback to mock data
export async function getProjects() {
  try {
    const pool = await getPool();
    if (!pool) return mockProjects;
    
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.warn('⚠️ Using mock project data:', error.message);
    return mockProjects;
  }
}

export async function getProject(id) {
  try {
    const pool = await getPool();
    if (!pool) return mockProjects[0];
    
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.warn('⚠️ Using mock project data:', error.message);
    return mockProjects[0];
  }
}

export async function createProject(project) {
  try {
    const pool = await getPool();
    if (!pool) throw new Error('Database not available');
    
    const [result] = await pool.query(
      'INSERT INTO projects (title, description, image, link, tags) VALUES (?, ?, ?, ?, ?)',
      [project.title, project.description, project.image, project.link, project.tags]
    );
    return getProject(result.insertId);
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

// Blog functions with fallback to mock data
export async function getBlogPosts() {
  try {
    const pool = await getPool();
    if (!pool) return mockPosts;
    
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.warn('⚠️ Using mock blog data:', error.message);
    return mockPosts;
  }
}

export async function getBlogPost(id) {
  try {
    const pool = await getPool();
    if (!pool) return mockPosts[0];
    
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.warn('⚠️ Using mock blog data:', error.message);
    return mockPosts[0];
  }
}

export async function createBlogPost(post) {
  try {
    const pool = await getPool();
    if (!pool) throw new Error('Database not available');
    
    const [result] = await pool.query(
      'INSERT INTO blog_posts (title, content, image) VALUES (?, ?, ?)',
      [post.title, post.content, post.image]
    );
    return getBlogPost(result.insertId);
  } catch (error) {
    throw new Error(`Failed to create blog post: ${error.message}`);
  }
}

// Admin functions
export async function getAdmin(username) {
  try {
    const pool = await getPool();
    if (!pool) return null;
    
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  } catch (error) {
    console.warn('⚠️ Admin lookup failed:', error.message);
    return null;
  }
}

export async function createAdmin(username, password) {
  try {
    const pool = await getPool();
    if (!pool) throw new Error('Database not available');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to create admin: ${error.message}`);
  }
}