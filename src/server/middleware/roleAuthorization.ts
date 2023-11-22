import { TRPCError } from "@trpc/server";
import { t } from "../api/trpc";
import { useRouter } from "next/router";

export type AuthorizedRoles = Array<
  "user" | "admin" | "superAdmin" | "owner" | "member"
>;

export const roleAuthorization = (roles: AuthorizedRoles) => {
  return t.middleware(async ({ ctx, next }) => {
    
    const role = ctx.session?.user?.role;
    if (role && roles.includes(role)) {
      return next();
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized here!",
    });
  });
};
