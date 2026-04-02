import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if request is for admin routes
  if (pathname.startsWith('/admin')) {
    // Get the host to check if it's localhost
    const host = request.headers.get('host');
    
    // Allow access only on localhost or during development
    const isLocalhost = host?.includes('localhost') || 
                       host?.includes('127.0.0.1') || 
                       host?.includes('::1') ||
                       process.env.NODE_ENV === 'development';
    
    // If not localhost, redirect to home page
    if (!isLocalhost) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
