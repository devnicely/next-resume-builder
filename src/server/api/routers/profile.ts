import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  updateUserDetailsSchema,
  updateUserSecuritySchema,
} from "~/validation/profile";
import { hash } from "argon2";
import crypto from "crypto";
import { sendEmailChangeRequest } from "~/utils/sendEmail";

async function hashPassword(password: string) {
  return await hash(password);
}

export const userProfileRouter = createTRPCRouter({
  getMyDetails: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session?.user.userId },
        select: {
          id: true,
          email: true,
          isVerified: true,
          passwordLastUpdate: true,
          avatar: true,
          country: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          role: true,
          memberships: true,
          loginToken: true,
          loginTokenExpires: true,
          verificationLinksSent: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        success: true,
        message: "User valid",
        user,
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
  updateUserDetails: protectedProcedure
    .input(updateUserDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      const { firstName, lastName, country, avatar } = input;

      try {
        await ctx.prisma.user.findUnique({
          where: { id: ctx.session?.user.userId },
          select: {
            avatar: true,
          },
        });
        await ctx.prisma.user.update({
          where: { id: ctx.session?.user.userId },
          data: {
            firstName,
            lastName,
            country,
            avatar: {
              update: {
                url: avatar?.url,
                public_id: avatar?.public_id,
              },
            },
          },
        });

        return {
          success: true,
          message: "User details updated successfully",
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
  updateUserPassword: protectedProcedure
    .input(updateUserSecuritySchema)
    .mutation(async ({ input, ctx }) => {
      const { newPassword, confirmPassword, email } = input;

      try {
        const transactionData = [];
        let verificationToken;

        if (newPassword && newPassword !== "") {
          if (newPassword !== confirmPassword) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Password confirmation does not match",
            });
          }
          const hashedPassword = await hashPassword(newPassword);
          transactionData.push(
            ctx.prisma.user.update({
              where: { id: ctx.session?.user.userId },
              data: {
                password: hashedPassword,
                passwordLastUpdate: new Date(),
              },
            })
          );
        }

        if (email) {
          verificationToken = crypto.randomBytes(32).toString("hex");

          const existingToken = await ctx.prisma.verificationToken.findFirst({
            where: {
              OR: [{ email: email }, { token: verificationToken }],
            },
          });

          if (existingToken) {
            await ctx.prisma.verificationToken.delete({
              where: { id: existingToken.id },
            });
          }

          transactionData.push(
            ctx.prisma.verificationToken.create({
              data: {
                email,
                token: verificationToken,
                expires: new Date(Date.now() + 15 * 60 * 1000),
                identifier: ctx.session?.user.userId,
                actionType: "emailChange",
              },
            })
          );
        }

        await ctx.prisma.$transaction(transactionData);

        if (email && verificationToken) {
          try {
            await sendEmailChangeRequest({ email, verificationToken });
          } catch (error) {
            console.error("Failed to send email:", error);
          }
        } else {
          console.error(
            "Email or verification token is missing. Aborting email send."
          );
        }
        return {
          success: true,
          message: email
            ? "Password and email updated. Verification link sent to new email"
            : "Password updated",
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
  deleteAccount: protectedProcedure.mutation(async ({ input, ctx }) => {
    try {
      await ctx.prisma.user.delete({
        where: { id: ctx.session?.user.userId },
      });

      return {
        success: true,
        message: "User account deleted successfully",
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
