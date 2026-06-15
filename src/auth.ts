import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { envConfig } from "./lib/constants/env"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
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
        if (!credentials?.email || !credentials?.password) {
          console.log("DEBUG: Kredensial kosong");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
          console.log("DEBUG: User tidak ditemukan di DB");
          return null;
        }

        if (!user.passwordHash) {
          console.log("DEBUG: User tidak punya password (mungkin login via Google)");
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          console.log("DEBUG: Password salah");
          return null;
        }

        console.log("DEBUG: Login Berhasil untuk user:", user.email);
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Kita panggil DB untuk memastikan data role terbaru ada
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        });

        session.user.id = user.id;
        (session.user as any).role = dbUser?.role; // Ambil dari DB
      }
      return session;
    },
  },

})
