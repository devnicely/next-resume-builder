import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { cloudinaryModule } from "~/server/config/cloudinary";
import { roleAuthorization } from "~/server/middleware/roleAuthorization";

async function uploadToCloudinary(buffer: Buffer, path: string) {
  return new Promise((resolve, reject) => {
    cloudinaryModule.uploader
      .upload_stream({ folder: path }, (error, result) => {
        if (error ?? !result) {
          reject(new Error("Failed to upload image"));
          return;
        }
        resolve({
          success: true,
          image: { url: result.secure_url, public_id: result.public_id },
        });
      })
      .end(buffer);
  });
}

async function handleUserAvatarUpload(input, ctx, uploadResult) {
  const { imgName } = input;
  const userId = ctx.session.user.userId;

  const currentUser = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatar: {
        select: {
          id: true,
          public_id: true,
        },
      },
    },
  });

  if (currentUser?.avatar?.public_id) {
    await cloudinaryModule.uploader.destroy(currentUser.avatar.public_id);
  }

  await ctx.prisma.$transaction([
    ctx.prisma.avatar.deleteMany({ where: { userId } }),
    ctx.prisma.avatar.create({
      data: {
        url: uploadResult.image.url,
        public_id: uploadResult.image.public_id,
        imgName,
        userId,
      },
    }),
  ]);

  const newAvatar = await ctx.prisma.avatar.findFirst({
    where: { userId },
  });

  await ctx.prisma.user.update({
    where: { id: userId },
    data: { avatarId: newAvatar.id },
  });

  return newAvatar.id;
}

async function handleOrganizationAvatarUpload(input, ctx, uploadResult) {
  const { imgName, orgId } = input;

  const currentOrg = await ctx.prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      orgAvatar: {
        select: {
          id: true,
          public_id: true,
        },
      },
    },
  });

  if (currentOrg?.orgAvatar?.public_id) {
    await cloudinaryModule.uploader.destroy(currentOrg.orgAvatar.public_id);
  }

  await ctx.prisma.$transaction([
    ctx.prisma.organizationAvatar.deleteMany({
      where: { organizationId: orgId },
    }),
    ctx.prisma.organizationAvatar.create({
      data: {
        url: uploadResult.image.url,
        public_id: uploadResult.image.public_id,
        organizationId: orgId,
        imgName,
      },
    }),
  ]);

  const newOrgAvatar = await ctx.prisma.organizationAvatar.findFirst({
    where: { organizationId: orgId },
  });

  await ctx.prisma.organization.update({
    where: { id: orgId },
    data: { orgAvatarId: newOrgAvatar.id },
  });

  return newOrgAvatar.id;
}

export const uploadRouter = createTRPCRouter({
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        file: z.any(),
        path: z.any(),
        imgName: z.string(),
        orgId: z.string().optional(),
      })
    )
    .use(roleAuthorization(["admin", "user", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      const { file, path, orgId } = input;
      const buffer = Buffer.from(file, "base64");

      if (buffer.length > 5 * 1024 * 1024) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "File size exceeds the 5MB limit.",
        });
      }

      try {
        const uploadResult = await uploadToCloudinary(buffer, path);

        let avatarId = null;

        if (uploadResult?.success) {
          if (orgId) {
            avatarId = await handleOrganizationAvatarUpload(
              input,
              ctx,
              uploadResult
            );
          } else {
            avatarId = await handleUserAvatarUpload(input, ctx, uploadResult);
          }

          return {
            success: true,
            message: "Avatar uploaded and linked successfully",
            avatarId,
          };
        } else {
          throw new Error("Failed to upload avatar");
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload avatar",
        });
      }
    }),
});
