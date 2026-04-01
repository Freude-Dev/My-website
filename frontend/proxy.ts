import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const access = request.cookies.get('admin-access')?.value
  const refresh = request.cookies.get('admin-refresh')?.value
  const legacy = request.cookies.get('admin-token')?.value
  const loggedIn = Boolean(access || refresh || legacy)

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !isLoginPage && !loggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginPage && loggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isAdminRoute && !isLoginPage && loggedIn) {
    const res = NextResponse.next()
    if (process.env.NODE_ENV === 'production') {
      res.headers.set('X-Frame-Options', 'DENY')
      res.headers.set('X-Content-Type-Options', 'nosniff')
      res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    }
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
