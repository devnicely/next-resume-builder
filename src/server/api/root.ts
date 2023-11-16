import { createTRPCRouter } from "~/server/api/trpc";
import { authenticationRouter } from "./routers/authentication";
import { userProfileRouter } from "./routers/profile";
import { organizationRouter } from "./routers/organization";
import { teamRouter } from "./routers/team";
import { uploadRouter } from "./routers/upload";
import { stripeRouter } from "./routers/stripe";
import { resumeRouter } from "./routers/resume";
import { templateRouter } from "./routers/template";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  authentication: authenticationRouter,
  profile: userProfileRouter,
  organization: organizationRouter,
  team: teamRouter,
  upload: uploadRouter,
  stripe: stripeRouter,
  resume: resumeRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
