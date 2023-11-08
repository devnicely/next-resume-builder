import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

type RedirectionType = "PROTECTED" | "UNPROTECTED";

export const handleRedirection = (type: RedirectionType) => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (type === "PROTECTED" && !session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    } else if (type === "UNPROTECTED" && session) {
      return {
        redirect: {
          destination: "/user/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  };
};
