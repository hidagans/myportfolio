import type { APIRoute } from 'astro';
import { login } from '../../utils/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return redirect('/admin/login?error=invalid');
  }

  const token = await login(username, password);
  if (!token) {
    return redirect('/admin/login?error=invalid');
  }

  cookies.set('admin-token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return redirect('/admin');
}