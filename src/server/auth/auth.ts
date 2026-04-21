import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    CredentialsProvider({
      name: "Dev Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "pm@example.com" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.active) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Include id for server-side permission checks.
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

