import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initDatabase() {
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
}

// Initialize tables
initDatabase().catch(console.error);

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
}

// Project functions
export async function getProjects() {
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  return rows as Project[];
}

export async function getProject(id: number) {
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
  return (rows as Project[])[0];
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>) {
  const [result] = await pool.query(
    'INSERT INTO projects (title, description, image, link, tags) VALUES (?, ?, ?, ?, ?)',
    [project.title, project.description, project.image, project.link, project.tags]
  );
  const id = (result as any).insertId;
  return getProject(id);
}

// Blog functions
export async function getBlogPosts() {
  const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
  return rows as BlogPost[];
}

export async function getBlogPost(id: number) {
  const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
  return (rows as BlogPost[])[0];
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>) {
  const [result] = await pool.query(
    'INSERT INTO blog_posts (title, content, image) VALUES (?, ?, ?)',
    [post.title, post.content, post.image]
  );
  const id = (result as any).insertId;
  return getBlogPost(id);
}

// Admin functions
export async function getAdmin(username: string) {
  const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
  return (rows as Admin[])[0];
}

export async function createAdmin(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO admins (username, password) VALUES (?, ?)',
    [username, hashedPassword]
  );
  return result;
}