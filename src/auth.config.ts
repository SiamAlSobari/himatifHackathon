import type { NextAuthConfig } from "next-auth";

// auth.config.ts
export const authConfig = {
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request }) {
      // Pastikan auth tidak null dan punya user id
      return !!auth?.user?.id;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
