"use server";

import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = 'http://localhost:5000/api';

export async function loginAction(email: string, pass: string) {
  if (!JWT_SECRET) {
    return { success: false, message: 'Server configuration error: Missing JWT_SECRET' };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      const cookieStore = await cookies();
      cookieStore.set('admin-token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return { success: true };
    }

    return { success: false, message: data.message || 'Invalid credentials' };
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, message: 'Could not connect to authentication server' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
}

/**
 * Securely fetches data from the backend using the httpOnly cookie.
 * This function runs on the server, so the token is never exposed to the client JS.
 */
export async function adminFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized', status: 401 };
  }

  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      return { success: true, status: 204 };
    }

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return { success: false, message: 'Server connection error', status: 500 };
  }
}