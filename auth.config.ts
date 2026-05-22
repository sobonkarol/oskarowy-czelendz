import type { NextAuthConfig } from "next-auth"

export default {
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage =
        request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/register")

      if (isAuthPage) return true
      return isLoggedIn
    },
  },
} satisfies NextAuthConfig
