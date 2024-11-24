import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { getAdmin } from './db.js';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function createToken(userId) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function isLoggedIn(Astro) {
  const token = Astro.cookies.get('admin-token')?.value;
  if (!token) return false;
  
  const payload = await verifyToken(token);
  return !!payload;
}

export async function login(username, password) {
  const admin = await getAdmin(username);
  if (!admin) return null;
  
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return null;
  
  return await createToken(admin.id);
}