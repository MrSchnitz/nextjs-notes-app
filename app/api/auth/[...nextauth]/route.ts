import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string,
) {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword); // returns true or false
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const handler = NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: {
          label: "Username",
          type: "text",
          placeholder: "Your username",
        },
        password: {
          label: "Password",
          type: "text",
          placeholder: "Your password",
        },
      },

      async authorize(credentials) {
        console.log("CredentialsProvider", credentials);
        const user = await prisma.user.findFirst({
          where: { name: credentials?.userName },
        });

        if (
          !user ||
          !(await verifyPassword(credentials?.password ?? "", user.password))
        ) {
          return null;
        }

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin", // Displays signin buttons
  },

  // Enable debug messages in the console if you are having problems
  debug: true,
});

export { handler as authOptions, handler as GET, handler as POST };
