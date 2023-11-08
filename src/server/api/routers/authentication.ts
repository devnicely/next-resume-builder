import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type SignupOutput,
  forgotPasswordSchema,
  registerUserSchema,
  userResetPasswordSchema,
  verifyEmailSchema,
  type ForgotPwOutput,
  type VerifyEmailOutput,
  type UserSetNewPasswordOutput,
  type ResendVerificationEmailOutput,
} from "~/validation/auth";
import {
  resendVerificationEmail,
  sendVerificationEmail,
} from "~/utils/sendEmail";

export const authenticationRouter = createTRPCRouter({
  signup: publicProcedure
    .input(registerUserSchema)
    .mutation<SignupOutput>(async ({ input, ctx }) => {
      try {
        const { email, password, tempOrgName, firstName } = input;

        const exists = await ctx.prisma.user.findFirst({
          where: { email },
        });

        if (exists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This account cannot be created at the time.",
          });
        }

        const existingToken = await ctx.prisma.verificationToken.findFirst({
          where: { email },
        });
        if (existingToken) {
          await ctx.prisma.verificationToken.delete({
            where: { email },
          });
        }

        const user = await ctx.prisma.user.create({
          data: {
            email,
            password: await hash(password),
            tempOrgName,
            firstName,
          },
        });

        if (!user ?? !user.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user.",
          });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        await ctx.prisma.verificationToken.create({
          data: {
            email,
            token: verificationToken,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            identifier: user.id,
            actionType: "registration",
          },
        });

        if (email && verificationToken) {
          try {
            await sendVerificationEmail({ email, verificationToken });
          } catch (error) {
            console.error("Failed to send email:", error);
          }
        } else {
          console.error(
            "Email or verification token is missing. Aborting email send."
          );
        }

        return {
          status: 201,
          message:
            "Account created successfully, we have sent you an email with an activation link.",
          result: email,
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
  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation<ForgotPwOutput>(async ({ input, ctx }) => {
      try {
        const { email } = input;
        const user = await ctx.prisma.user.findFirst({
          where: { email },
        });
        if (!user) {
          return {
            status: 201,
            message:
              "If your email is correct, you will receive an email to change your password shortly. ",
          };
        }
        if (!user?.isVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only verified users can reset password",
          });
        }
        const existingRecord = await ctx.prisma.resetToken.findFirst({
          where: { email },
        });

        const currentDate = new Date();
        const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

        if (
          existingRecord &&
          existingRecord.requests >= 3 &&
          existingRecord.lastRequestedAt > oneDayAgo
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Rate limit exceeded, please contact support",
          });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        if (existingRecord) {
          await ctx.prisma.resetToken.update({
            where: { email },
            data: {
              token: resetToken,
              expires: new Date(Date.now() + 15 * 60 * 1000), // Token valid for 15 minutes
              requests: existingRecord.requests + 1,
              lastRequestedAt: currentDate,
            },
          });
        } else {
          await ctx.prisma.resetToken.create({
            data: {
              email,
              token: resetToken,
              expires: new Date(Date.now() + 15 * 60 * 1000), // Token valid for 15 minutes
              requests: 1,
              lastRequestedAt: currentDate,
            },
          });
        }

        const msg = {
          to: email,
          from: "no-reply@prospectai.ai",
          subject: "Password Reset",
          text: `You have requested a password reset. Click this link to reset your password: ${process.env.NEXT_PUBLIC_DEV_URL}/auth/reset-password?token=${resetToken}`,
        };

        await sgMail.send(msg);
        return {
          status: 201,
          message:
            "If your email is correct, you will receive an email to change your password shortly. ",
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
  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation<VerifyEmailOutput>(async ({ input, ctx }) => {
      try {
        const { token, email } = input;

        const verificationRecord = await ctx.prisma.verificationToken.findFirst(
          {
            where: { token, email },
          }
        );

        if (
          !verificationRecord ||
          new Date() > new Date(verificationRecord.expires)
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired verification token",
          });
        }

        const user = await ctx.prisma.user.findFirst({
          where: { id: verificationRecord.identifier! },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (verificationRecord.actionType === "registration") {
          try {
            await ctx.prisma.user.update({
              where: { id: user.id },
              data: {
                isVerified: true,
                role: "owner",
                status: "ACTIVE",
              },
            });

            return {
              status: 200,
              message: "Email verified successfully",
              response: user,
              loginToken: verificationRecord.token,
            };
          } catch (error) {
            console.error("Transaction failed: ", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to complete operations, please try again.",
            });
          }
        } else if (verificationRecord.actionType === "emailChange") {
          await ctx.prisma.user.update({
            where: { id: user.id },
            data: { email: verificationRecord.email },
          });
        } else {
          await ctx.prisma.user.update({
            where: { id: user.id },
            data: { email: verificationRecord.email },
          });
        }

        const existingToken = await ctx.prisma.verificationToken.findFirst({
          where: { email: verificationRecord.email },
        });

        if (existingToken) {
          await ctx.prisma.verificationToken.delete({
            where: { email: verificationRecord.email },
          });
        } else {
          console.warn("Warning: Token already deleted");
        }

        return {
          status: 200,
          message:
            verificationRecord.actionType === "registration"
              ? "Email verified successfully"
              : verificationRecord.actionType === "emailChange"
              ? "Email changed successfully"
              : "Joined successfully",
          loginToken: verificationRecord.token,
          response: user,
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
  userSetNewPassword: publicProcedure
    .input(userResetPasswordSchema)
    .mutation<UserSetNewPasswordOutput>(async ({ input, ctx }) => {
      try {
        const { token, newPassword, isInvite } = input;

        let userIdentifier;

        if (isInvite) {
          const verificationToken =
            await ctx.prisma.verificationToken.findUnique({
              where: { token },
            });

          if (!verificationToken || verificationToken.expires < new Date()) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid or expired verification token.",
            });
          }

          const user = await ctx.prisma.user.findUnique({
            where: { email: verificationToken.email },
          });

          if (!user) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User not found.",
            });
          }

          userIdentifier = { email: verificationToken.email };
        } else {
          const resetRecord = await ctx.prisma.resetToken.findFirst({
            where: { token },
          });

          if (!resetRecord || new Date() > new Date(resetRecord.expires)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid or expired reset token",
            });
          }
          userIdentifier = { email: resetRecord.email };
        }

        const hashedPassword = await hash(newPassword);

        await ctx.prisma.user.update({
          where: userIdentifier,
          data: {
            password: hashedPassword,
            status: "ACTIVE",
          },
        });

        if (isInvite) {
          await ctx.prisma.verificationToken.delete({ where: { token } });
        } else {
          await ctx.prisma.resetToken.delete({ where: userIdentifier });
        }

        return { status: 200, message: "Password reset successfully" };
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
  resendVerificationEmail: publicProcedure
    .input(forgotPasswordSchema)
    .mutation<ResendVerificationEmailOutput>(async ({ input, ctx }) => {
      try {
        const { email } = input;

        const user = await ctx.prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        if (user.isVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This account is already verified.",
          });
        }

        if (user.verificationLinksSent >= 3) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message:
              "You have exceeded the number of requests, please contact support for additional help.",
          });
        }

        const newVerificationToken = crypto.randomBytes(32).toString("hex");

        await ctx.prisma.verificationToken.upsert({
          where: { email },
          update: {
            token: newVerificationToken,
            expires: new Date(Date.now() + 15 * 60 * 1000), // Token valid for 15 minutes
          },
          create: {
            email,
            token: newVerificationToken,
            expires: new Date(Date.now() + 15 * 60 * 1000), // Token valid for 15 minutes
            identifier: user.id,
            actionType: "registration",
          },
        });

        await ctx.prisma.user.update({
          where: { email },
          data: { verificationLinksSent: { increment: 1 } },
        });

        await resendVerificationEmail({ email, newVerificationToken });

        return {
          status: 200,
          message: "Verification email resent successfully.",
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
