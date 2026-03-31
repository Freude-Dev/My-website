import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { endpoint, method, body } = await request.json()

    // Read httpOnly cookie server-side — this is the correct way
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated. Please log in again.' },
        { status: 401 }
      )
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`

    const res = await fetch(apiUrl, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Backend request failed' },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error('Admin proxy error:', err)
    return NextResponse.json(
      { message: 'Proxy error: ' + err.message },
      { status: 500 }
    )
  }
}
