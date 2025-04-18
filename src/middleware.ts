import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest)
{
  const { pathname } = request.nextUrl

  // Allow unauthenticated access to /login and /api/auth
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth")
  )
  {
    return NextResponse.next()
  }

  // Check for a valid NextAuth session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token)
  {
   // Redirect unauthenticated users to /login
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
 }

  // Allow authenticated users
   return NextResponse.redirect(new URL("/dashboard"))
}

// Protect all routes except /login and /api/auth
export const config = {
  matcher: [
    "/((?!login|api/auth|api|_next/static|_next/image|favicon.ico).*)",
  ],
}