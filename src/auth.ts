import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { envConfig } from "./lib/constants/env"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
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
          isOnboarded: user.isOnboarded,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.isOnboarded = (user as any).isOnboarded

        if ((user as any).role === "PSYCHOLOGY") {
          const profile = await db.psychologistProfile.findUnique({
            where: { userId: user.id }
          })
          if (profile) {
            token.picture = profile.imageUrl
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).isOnboarded = token.isOnboarded as boolean;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session
    },
  },
})