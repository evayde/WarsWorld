import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "server/prisma/prisma-client";
import { User } from "@prisma/client";
import { loginSchema } from "server/schemas/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        // TODO: Change name to a unique identifier, maybe for email or both idk.
        name: {
          label: "Username",
          type: "username",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.name || !credentials.password)
          return null;

        const creds = await loginSchema.parseAsync({
          username: credentials.name,
          password: credentials.password,
        });

        const dbUser = await prisma.user.findFirst({
          where: { name: creds.username },
        });

        // Verify Password here
        // TODO: Encryption here
        if (dbUser && dbUser.password === credentials.password) {
          const dbUserWithoutPassword = {
            name: dbUser.name,
            email: dbUser.email,
          };
          return dbUserWithoutPassword as User;
        }

        return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/?loginOpen",
    // signOut: "/",
    error: "/?loginOpen", // Error code passed in query string as ?error=
    // verifyRequest: "/", // (used for check email message)
    // newUser: "/",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin";
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl; // redirect callback
    },
  },
};

export default authOptions;
