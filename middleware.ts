import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Route yang bisa diakses tanpa login
const PUBLIC_PATHS = ["/login", "/register", "/psikolog/login", "/psikolog/register", "/forgot-password", "/reset-password"]

export default auth((req) => {

  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any
  const role = user?.role // "USER" | "PSYCHOLOGY"

  // Landing page ("/") dan auth pages = publik
  const isPublic =
    pathname === "/" || PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Belum login + bukan halaman publik → redirect ke login masing-masing
  if (!isLoggedIn && !isPublic) {
    const isPsikologRoute = pathname.startsWith("/psikolog")
    const loginPath = isPsikologRoute ? "/psikolog/login" : "/login"
    const loginUrl = new URL(loginPath, req.nextUrl)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Sudah login + akses halaman auth → redirect ke dashboard masing-masing
  if (isLoggedIn && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    let dest = "/dashboard"
    if (role === "PSYCHOLOGY") {
      dest = user?.isOnboarded ? "/psikolog" : "/psikolog/onboarding"
    } else if (!user?.isOnboarded) {
      dest = "/onboarding"
    }
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  // Sudah login + cek otorisasi role & onboarding status
  if (isLoggedIn) {
    const isOnboarded = !!user?.isOnboarded
    if (role === "PSYCHOLOGY") {
      if (!isOnboarded) {
        // Unonboarded psychologist must be forced to /psikolog/onboarding
        if (pathname !== "/psikolog/onboarding") {
          return NextResponse.redirect(new URL("/psikolog/onboarding", req.nextUrl))
        }
      } else {
        // Onboarded psychologist cannot access /psikolog/onboarding
        if (pathname === "/psikolog/onboarding") {
          return NextResponse.redirect(new URL("/psikolog", req.nextUrl))
        }
        // General role-based page restriction
        const allowed = pathname.startsWith("/psikolog") || pathname.startsWith("/konsultasi")
        if (!allowed) {
          return NextResponse.redirect(new URL("/psikolog", req.nextUrl))
        }
      }
    } else {
      // Regular user cannot access /psikolog/*
      if (pathname.startsWith("/psikolog")) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  // Jalankan middleware di semua route kecuali API, static files, dan favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
