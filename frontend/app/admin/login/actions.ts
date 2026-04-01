'use server'

import { cookies } from 'next/headers'

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

async function refreshTokens(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  const api = process.env.NEXT_PUBLIC_API_URL
  if (!api) return null
  const res = await fetch(`${api}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) return null
  return res.json()
}

async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  let access = cookieStore.get('admin-access')?.value
  const refresh = cookieStore.get('admin-refresh')?.value

  if (access) return access
  if (!refresh) return null

  const t = await refreshTokens(refresh)
  if (!t) return null

  cookieStore.set('admin-access', t.accessToken, {
    ...COOKIE_BASE,
    maxAge: 15 * 60,
  })
  cookieStore.set('admin-refresh', t.refreshToken, {
    ...COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60,
  })
  return t.accessToken
}

export async function loginAction(
  email: string,
  password: string,
  totp?: string
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, totp: totp || undefined }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Invalid credentials',
        requiresTotp: data.requiresTotp === true,
      }
    }

    if (!data.accessToken || !data.refreshToken) {
      return { success: false, message: 'Invalid server response' }
    }

    const cookieStore = await cookies()
    cookieStore.set('admin-access', data.accessToken, {
      ...COOKIE_BASE,
      maxAge: 15 * 60,
    })
    cookieStore.set('admin-refresh', data.refreshToken, {
      ...COOKIE_BASE,
      maxAge: 7 * 24 * 60 * 60,
    })
    cookieStore.delete('admin-token')

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'Could not reach the server. Is the backend running?',
    }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const access = cookieStore.get('admin-access')?.value
  const refresh = cookieStore.get('admin-refresh')?.value
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (apiUrl && (access || refresh)) {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: access, refreshToken: refresh }),
      })
    } catch {
      /* ignore */
    }
  }

  cookieStore.delete('admin-access')
  cookieStore.delete('admin-refresh')
  cookieStore.delete('admin-token')
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: string
}

export async function adminFetch(endpoint: string, options: FetchOptions = {}) {
  const token = await getValidAccessToken()

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
