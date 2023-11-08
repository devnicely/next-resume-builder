import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { roleAuthorization } from "~/server/middleware/roleAuthorization";
import {
  createOrganizationSchema,
  deleteOrganizationSchema,
  updateOrganizationSchema,
} from "~/validation/org";

export const organizationRouter = createTRPCRouter({
  createOrganization: publicProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId, orgName } = input;

      try {
        const existingOrg = await ctx.prisma.orgMembership.findFirst({
          where: {
            userId: userId,
            role: "owner",
          },
          include: {
            org: true,
          },
        });

        if (existingOrg) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Problem creating an organization, contact support for additional help.",
          });
        }

        const newOrg = await ctx.prisma.organization.create({
          data: {
            name: orgName,
            members: {
              create: {
                userId: userId,
                role: "owner",
                status: "ACTIVE",
              },
            },
          },
        });

        await ctx.prisma.user.update({
          where: { id: userId },
          data: { tempOrgName: null },
        });

        return {
          success: true,
          message: "Organization created successfully",
          newOrg,
        };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  getOrgDetails: protectedProcedure
    .use(roleAuthorization(["owner", "admin", "member", "user"]))
    .query(async ({ ctx }) => {
      try {
        const roles = ["owner", "admin", "member"];
        for (const role of roles) {
          const organization = await ctx.prisma.orgMembership.findFirst({
            where: {
              userId: ctx.session.user.userId,
              role: role,
            },
            include: {
              org: {
                include: {
                  orgAvatar: true,
                },
              },
            },
          });

          if (organization && organization.org) {
            return {
              success: true,
              message: `User is a(n) ${role}`,
              organization: organization.org,
            };
          }
        }

        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "User is neither an owner, admin, nor a member of any organization",
        });
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  updateOrganization: protectedProcedure
    .input(updateOrganizationSchema)
    .use(roleAuthorization(["admin", "owner"]))
    .mutation(async ({ input, ctx }) => {
      const {
        orgId,
        orgName,
        orgLocation,
        orgHeadcount,
        orgPhone,
        orgWebsite,
        orgAbout,
        orgAvatar,
      } = input;

      try {
        const membership = await ctx.prisma.orgMembership.findFirst({
          where: {
            orgId: orgId,
            role: {
              in: ["admin", "owner"],
            },
          },
        });

        if (!membership) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to update this organization",
          });
        }
        const updatedOrg = await ctx.prisma.organization.update({
          where: { id: orgId },
          data: {
            name: orgName,
            location: orgLocation,
            headcount: orgHeadcount,
            phone: orgPhone,
            website: orgWebsite,
            about: orgAbout,
            orgAvatarId: orgAvatar?.id,
            orgAvatar: {
              update: {
                url: orgAvatar?.url,
                public_id: orgAvatar?.public_id,
              },
            },
          },
        });

        return {
          success: true,
          message: "Organization details updated successfully",
          updatedOrg,
        };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
  deleteOrganization: protectedProcedure
    .input(deleteOrganizationSchema)
    .use(roleAuthorization(["admin", "owner"]))
    .query(async ({ input, ctx }) => {
      const { adminId, orgId } = input;

      try {
        // Step 1: Delete all members of the organization
        await ctx.prisma.orgMembership.deleteMany({
          where: { orgId },
        });

        // Step 2: Delete the organization
        const deletedOrg = await ctx.prisma.organization.delete({
          where: { id: orgId },
        });

        // Check if the adminId matches the organization's adminId
        if (deletedOrg.adminId !== adminId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this organization",
          });
        }

        return {
          success: true,
          message: "Organization and all its members have been deleted",
        };
      } catch (error) {
        console.log("error", error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error, please contact support",
            });
      }
    }),
});
