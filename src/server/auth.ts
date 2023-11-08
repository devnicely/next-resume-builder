// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { type GetServerSidePropsContext } from "next";
import { prisma } from "~/server/db";
import { verify } from "argon2";
import { loginUserSchema } from "~/validation/auth";
import Credentials from "next-auth/providers/credentials";
import {
  type NextAuthOptions,
  getServerSession,
  type DefaultSession,
} from "next-auth";
import { type AuthorizedRoles } from "./middleware/roleAuthorization";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      userId: string;
      role?: AuthorizedRoles;
      email: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    email: string;
    isVerified: boolean;
    role?: AuthorizedRoles;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsedCredentials = await loginUserSchema.parseAsync(credentials);
        const { email, password, loginToken } = parsedCredentials;

        try {
          if (loginToken && email && !password) {
            const user = await prisma.user.findUnique({
              where: {
                email,
                // loginToken,
                // loginTokenExpires: { gte: new Date(Date.now()).toISOString() },
              },
              include: { memberships: true },
            });

            if (!user) return null;

            return {
              id: user.id,
              email: user.email,
              isVerified: user.isVerified,
            };
          }
          if (email && password) {
            const { email, password } = await loginUserSchema.parseAsync(
              credentials
            );

            const result = await prisma.user.findFirst({
              where: { email },
              include: { memberships: true },
            });

            if (!result?.isVerified) return null;

            const isValidPassword = await verify(result.password, password);

            if (!isValidPassword) return null;

            return {
              id: result.id,
              email,
              isVerified: result.isVerified,
            };
          }
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.isVerified = user.isVerified;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        try {
          session.user.userId = token.userId;
          session.user.email = token.email;
          session.user.role = token.role;

          const user = await prisma.user.findUnique({
            where: { id: token.userId },
            select: { loginToken: true, role: true, status: true },
          });

          if (user?.role) {
            session.user.role = user.role;
          }

          if (user?.status) {
            session.user.status = user.status;
          }

          if (user?.loginToken) {
            await prisma.user.update({
              where: { id: token.userId },
              data: { loginToken: null },
            });
          }
        } catch (error) {
          console.error("Failed to update user:", error);
        }
      }
      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  // pages: {
  //   signIn: "/auth/login",
  //   newUser: "/auth/register",
  // },
  secret: process.env.JWT_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
