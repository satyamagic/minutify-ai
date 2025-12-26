import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This is a basic middleware setup
  // Firebase auth state is checked client-side in the layout component
  // For production, consider implementing server-side session management
  
  const { pathname } = request.nextUrl

  // Allow access to auth pages and root
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
    return NextResponse.next()
  }

  // All other routes are protected by client-side auth in layout
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
