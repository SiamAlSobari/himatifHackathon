import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { envConfig } from "./lib/constants/env"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" }, // Tetap gunakan database strategy
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(envConfig.GoogleClientId && envConfig.GoogleClientSecret
      ? [
          Google({
            clientId: envConfig.GoogleClientId!,
            clientSecret: envConfig.GoogleClientSecret!,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        // Return user object lengkap
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role, // Pastikan role disertakan di sini
        }
      },
    }),
  ],
  callbacks: {
    // Cukup gunakan session callback saja
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id as string
        // Sekarang role langsung diambil dari objek user yang sudah ter-load
        (session.user as any).role = (user as any).role
      }
      return session
    },
  },
})