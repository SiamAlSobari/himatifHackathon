import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Route yang bisa diakses tanpa login
const PUBLIC_PATHS = ["/login", "/register", "/psikolog/login", "/psikolog/register"]

export default auth((req) => {

  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any
  const role = user?.role // "USER" | "PSYCHOLOGY"

  // Landing page ("/") dan auth pages = publik
  const isPublic =
    pathname === "/" || PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Belum login + bukan halaman publik → redirect ke login
  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", req.nextUrl)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Sudah login + akses halaman auth → redirect ke dashboard masing-masing
  if (isLoggedIn && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const dest = role === "PSYCHOLOGY" ? "/psikolog" : "/dashboard"
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  // Sudah login + cek otorisasi role
  if (isLoggedIn) {
    if (role === "PSYCHOLOGY") {
      // Psikolog hanya bisa akses /psikolog/* dan /konsultasi/*
      const allowed = pathname.startsWith("/psikolog") || pathname.startsWith("/konsultasi")
      if (!allowed) {
        return NextResponse.redirect(new URL("/psikolog", req.nextUrl))
      }
    } else {
      // User biasa tidak boleh akses /psikolog/*
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
