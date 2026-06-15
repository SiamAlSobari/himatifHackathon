import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Route yang bisa diakses tanpa login
const PUBLIC_PATHS = ["/login", "/register"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Session cookie dari Auth.js
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value
  const isLoggedIn = !!sessionCookie

  // Landing page ("/") dan auth pages ("/login", "/register") = publik
  const isPublic =
    pathname === "/" || PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Belum login + bukan halaman publik → redirect ke /login
  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", req.nextUrl)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Sudah login + akses halaman auth → redirect ke /dashboard
  if (isLoggedIn && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  // Jalankan middleware di semua route kecuali API, static files, dan favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
