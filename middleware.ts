import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const isProtectedRoute = ['/cart', '/profile'].some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cart/:path*', '/profile/:path*'],
}
