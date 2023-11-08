import { useSession } from "next-auth/react";
import { type AuthorizedRoles } from "~/server/middleware/roleAuthorization";

export const useRoleCheck = (allowedRoles: AuthorizedRoles[]) => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user?.role as AuthorizedRoles | undefined;
  return Boolean(role && allowedRoles.includes(role));
};
