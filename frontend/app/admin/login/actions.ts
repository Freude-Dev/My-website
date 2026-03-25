'use server'

import { cookies } from 'next/headers'

export async function loginAction(email: string, password: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || 'Invalid credentials' }
    }

    const cookieStore = await cookies()
    cookieStore.set('admin-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'Could not reach the server. Is the backend running?' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: string
}

export async function adminFetch(endpoint: string, options: FetchOptions = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) {
    return { success: false, message: 'Not authenticated' }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: options.body,
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Admin fetch error:', error)
    return { success: false, message: 'Server error' }
  }
}