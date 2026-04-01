import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

function applyAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set('admin-access', accessToken, {
    ...COOKIE_BASE,
    maxAge: 15 * 60,
  })
  response.cookies.set('admin-refresh', refreshToken, {
    ...COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60,
  })
}

async function refreshSession(
  refreshToken: string,
  apiUrl: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const res = await fetch(`${apiUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    const { endpoint, method, body } = await request.json()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    let accessToken = cookieStore.get('admin-access')?.value
    const refreshToken = cookieStore.get('admin-refresh')?.value
    let rotated: { accessToken: string; refreshToken: string } | null = null

    if (!accessToken && refreshToken) {
      rotated = await refreshSession(refreshToken, apiUrl)
      if (rotated) accessToken = rotated.accessToken
    }

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated. Please log in again.' },
        { status: 401 }
      )
    }

    const doFetch = (token: string) =>
      fetch(`${apiUrl}/api${endpoint}`, {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        cache: 'no-store',
      })

    let res = await doFetch(accessToken)

    if (res.status === 401 && refreshToken) {
      const refreshed = await refreshSession(refreshToken, apiUrl)
      if (refreshed) {
        rotated = refreshed
        res = await doFetch(refreshed.accessToken)
      }
    }

    const data = await res.json()
    const response = NextResponse.json(data, { status: res.status })
    if (rotated) {
      applyAuthCookies(response, rotated.accessToken, rotated.refreshToken)
    }
    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Admin proxy error:', err)
    return NextResponse.json({ message: 'Proxy error: ' + message }, { status: 500 })
  }
}
