import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { type Session } from "next-auth";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "../auth";

export type CreateContextOptions = {
  prisma: any;
  session: Session | null;
  revalidateSSG:
    | ((
        urlPath: string,
        opts?:
          | {
              unstable_onlyGenerated?: boolean | undefined;
            }
          | undefined
      ) => Promise<void>)
    | null;
};

export const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    session: _opts.session,
    revalidateSSG: _opts.revalidateSSG,
    prisma,
  };
};

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const { req, res } = _opts;
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
    revalidateSSG: res.revalidate,
  });
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized to access this resource",
    });
  }
  return next();
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
