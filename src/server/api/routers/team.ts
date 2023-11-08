import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { roleAuthorization } from "~/server/middleware/roleAuthorization";
import { acceptInviteSchema, inviteTeamMemberSchema } from "~/validation/team";
import { sendOrgInvite } from "~/utils/sendEmail";
import crypto from "crypto";

type WhereClauseType = {
  orgId: string;
  NOT: { userId: string }[];
  role?: "admin" | "owner" | "member";
  status?: string;
};

export const teamRouter = createTRPCRouter({
  inviteTeamMember: protectedProcedure
    .input(inviteTeamMemberSchema)
    .use(roleAuthorization(["admin", "owner"]))
    .mutation(async ({ input, ctx }) => {
      const { orgId, emails } = input;

      try {
        const createUserAndTokenPromises = emails.map(async (email) => {
          try {
            const existingUser = await ctx.prisma.user.findUnique({
              where: { email },
            });

            if (existingUser) {
              console.log(`Skipping existing user: ${email}`);
              return;
            }

            const user = await ctx.prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                status: "PENDING",
                role: "member",
              },
            });

            const verificationToken = crypto.randomBytes(32).toString("hex");

            await ctx.prisma.verificationToken.create({
              data: {
                email,
                token: verificationToken,
                expires: new Date(Date.now() + 15 * 60 * 1000),
                orgId,
                actionType: "inviteTeam",
              },
            });

            await ctx.prisma.orgMembership.create({
              data: {
                userId: user.id,
                orgId,
                role: "member",
                status: "PENDING",
              },
            });

            await sendOrgInvite({
              email,
              verificationToken,
              orgId,
            });
          } catch (error) {
            throw error instanceof TRPCError
              ? error
              : new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Internal server error, please contact support",
                });
          }
        });

        await Promise.all(createUserAndTokenPromises);

        return {
          status: 200,
          success: true,
          message: "Invitation emails sent successfully.",
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
  resendTeamMemberInvite: protectedProcedure
    .input(z.object({ orgId: z.string(), email: z.string() }))
    .use(roleAuthorization(["admin", "owner"]))
    .mutation(async ({ input, ctx }) => {
      const { orgId, email } = input;
      try {
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser || existingUser.status !== "PENDING") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No pending user found with the provided email",
          });
        }

        await ctx.prisma.verificationToken.deleteMany({
          where: {
            email,
            orgId,
            actionType: "inviteTeam",
          },
        });

        const newVerificationToken = crypto.randomBytes(32).toString("hex");
        await ctx.prisma.verificationToken.create({
          data: {
            email,
            token: newVerificationToken,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            orgId,
            actionType: "inviteTeam",
          },
        });

        await sendOrgInvite({
          email,
          verificationToken: newVerificationToken,
          orgId,
        });

        return {
          status: 200,
          success: true,
          message: "Invitation email resent successfully.",
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
  acceptInvite: publicProcedure
    .input(acceptInviteSchema)
    .mutation(async ({ input, ctx }) => {
      const { orgId, email, token } = input;

      try {
        const verificationToken = await ctx.prisma.verificationToken.findUnique(
          {
            where: { token },
          }
        );

        if (!verificationToken || verificationToken.expires < new Date()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired verification token.",
          });
        }

        // Check for the user by email
        const user = await ctx.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        await ctx.prisma.$transaction([
          ctx.prisma.orgMembership.update({
            where: { orgId_userId: { orgId: orgId, userId: user.id } },
            data: { status: "ACTIVE" },
          }),
          ctx.prisma.user.update({
            where: { id: user.id },
            data: {
              isVerified: true,
              status: "ACTIVE",
            },
          }),
          // ctx.prisma.verificationToken.delete({ where: { token } }),
        ]);

        return {
          status: 200,
          success: true,
          message: "Successfully joined your organization!",
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
  getAllTeamMembers: protectedProcedure
    .use(roleAuthorization(["admin", "owner", "member"]))
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.session.user.userId;
        const requestingUser = await ctx.prisma.orgMembership.findFirst({
          where: {
            userId: userId,
          },
          select: {
            role: true,
            orgId: true,
          },
        });

        if (!requestingUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User is not a member of any organization",
          });
        }

        const { orgId, role } = requestingUser;

        let whereClause: WhereClauseType = {
          orgId: orgId,
          NOT: [
            {
              userId: userId,
            },
          ],
          // Existing members only for the "member" role
          status: role === "member" ? "ACTIVE" : undefined,
        };

        if (role === "member") {
          whereClause = {
            ...whereClause,
            role: "member",
          };
        }

        const teamMembers = await ctx.prisma.orgMembership.findMany({
          where: whereClause,
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                status: true,
                role: true,
              },
            },
          },
        });

        return {
          success: true,
          orgId: orgId,
          message: "Team members fetched successfully",
          teamMembers: teamMembers.map((member) => member.user),
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
  deleteMember: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .use(roleAuthorization(["admin", "owner"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const { orgId } = input;
        const userId = ctx.session.user.userId;
        const isMember = await ctx.prisma.orgMembership.findFirst({
          where: {
            userId: userId,
            orgId: orgId,
          },
        });

        if (!isMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User is not a member of the specified organization",
          });
        }

        await ctx.prisma.$transaction([
          ctx.prisma.orgMembership.deleteMany({
            where: {
              userId: userId,
              orgId: orgId,
            },
          }),
          ctx.prisma.user.update({
            where: { id: userId },
            data: {
              status: "PENDING",
            },
          }),
        ]);

        return {
          success: true,
          message: "Member deleted successfully",
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
  updateMember: protectedProcedure
    .input(
      z.object({
        newRole: z.enum(["admin", "owner", "member"]),
      })
    )
    .use(roleAuthorization(["admin", "owner"])) // Only admin and owner should be allowed to update roles
    .mutation(async ({ input, ctx }) => {
      try {
        const { newRole } = input;
        const userId = ctx.session.user.userId;
        // First, update the role in OrgMembership table
        const updatedOrgMembership = await ctx.prisma.orgMembership.updateMany({
          where: { userId: userId },
          data: { role: newRole },
        });

        // Then update the role in User table
        const updatedUser = await ctx.prisma.user.update({
          where: { id: userId },
          data: { role: newRole },
        });

        if (updatedOrgMembership.count && updatedUser) {
          return {
            success: true,
            message: `Role updated to ${newRole} successfully`,
          };
        } else {
          return {
            success: false,
            message: `Failed to update role to ${newRole}`,
          };
        }
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
