import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

// Options for NextAuth
export const authOptions: NextAuthOptions = {
  // Secret for encrypting tokens, should be set in .env.local
  secret: process.env.NEXTAUTH_SECRET!,
  pages: { signIn: "/login" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
}

// NextAuth handler
export const handlers = NextAuth(authOptions)