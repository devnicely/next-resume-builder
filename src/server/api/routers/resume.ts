import { roleAuthorization } from "~/server/middleware/roleAuthorization";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  deleteResumesSchema,
  inviteTeamMembersSchema,
  parseResumeSchema,
  updateResumeStatusSchema,
  updateTeamAccessInputSchema,
} from "~/validation/resume";
import { generateResumeId } from "~/helpers/generateRandomId";
import {  PrismaClient } from "@prisma/client";
import { sendInviteToParse } from "~/utils/sendEmail";
import axios from "axios";
import FormData from "form-data";
import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";
import path from "path";
import { SHORT_ID_LENGTH, defaultResumeState } from "~/constants";
import { nanoid } from "nanoid";
import { CreateResumeParamsSchema, ResumeSchema, ResumeSchemaType, Resume, Basics, DeleteResumeParamsSchema, RenameResumeParamsSchema } from "~/schema";
import { z } from "zod";

interface CTX {
  prisma: PrismaClient;
  // ...other fields
}

async function createPermission(
  ctx: CTX,
  resumeId: string,
  userId: string,
  permission: string
) {
  return await ctx.prisma.resumePermission.create({
    data: {
      document: {
        connect: {
          id: resumeId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      permission,
    },
  });
}

async function checkIfResumeIdExists(ctx: CTX) {
  let unique = false;
  let newResumeId = "";

  while (!unique) {
    newResumeId = generateResumeId();

    const existingResume = await ctx.prisma.resume.findUnique({
      where: {
        resumeId: newResumeId,
      },
    });

    if (!existingResume) {
      unique = true;
    }
  }

  return newResumeId;
}

const deleteFileFromGCS = async (bucketName: string, fileName: string) => {
  const keyfileName = path.join(
    __dirname,
    "/server/config/resume-vetting-ai-30f397c1c13d.json"
  );

  const storage = new Storage({ keyfileName });
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  return new Promise<void>((resolve, reject) => {
    file.delete((err, apiResponse) => {
      if (err) {
        console.error("Error deleting file:", err);
        reject(err);
      } else {
        console.log(`File ${fileName} deleted.`);
        resolve();
      }
    });
  });
};

const updateResume = async (
  ctx: CTX,
  id: any,
  content: any,
  resumeId: string
) => {
  return await ctx.prisma.resume.update({
    where: { id },
    data: { content, resumeId },
  });
};

async function handleSinglePdf(base64pdf, title, teamMembers, ctx) {
  try {
    const uniqueResumeId = await checkIfResumeIdExists(ctx);

    // Create Resume and get its id
    const generatedResume = await ctx.prisma.resume.create({
      data: {
        resumeId: uniqueResumeId,
        content: "",
        title,
        uploadedBy: {
          connect: {
            id: ctx.session.user.userId,
          },
        },
      },
    });

    const resumeIdFromSchema = generatedResume.id;
    const pdfBuffer = Buffer.from(base64pdf, "base64");
    const form = new FormData();
    form.append("file", pdfBuffer, { filename: `${uniqueResumeId}.pdf` });

    const response = await axios.post(
      "https://resume-parser-api-v1.onrender.com/parse",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-API-Key": process.env.API_KEYS,
        },
      }
    );

    const apiData = response.data;

    if (apiData && apiData.json_url) {
      const content = apiData.json_url;

      await updateResume(ctx, resumeIdFromSchema, content, uniqueResumeId);

      // Initialize permissionPromises array with LEAD permission for the uploader
      const permissionPromises = [
        createPermission(
          ctx,
          resumeIdFromSchema,
          ctx.session.user.userId,
          "LEAD"
        ),
      ];

      // Add permission promises for team members
      for (const member of teamMembers) {
        permissionPromises.push(
          createPermission(
            ctx,
            resumeIdFromSchema,
            member.id,
            member.permission
          )
        );
        permissionPromises.push(
          sendInviteToParse({
            email: member.email,
            resumeID: resumeIdFromSchema,
          })
        );
      }

      await Promise.all(permissionPromises);
    } else {
      console.log("Unexpected API response format");
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("An error occurred while processing a PDF:", error);
    return { success: false };
  }
}

// Utility to format permissions into teams
const formatPermissions = (permissions, userId) =>
  permissions
    ? permissions.map((p) => ({
      firstName: p.user.firstName,
      avatar: p.user.avatar ? p.user.avatar.url : "",
      permission: p.permission,
    }))
    : [];

// Common select object for user data
const userSelect = {
  select: {
    firstName: true,
    avatar: { select: { url: true } },
  },
};


export const resumeRouter = createTRPCRouter({
  createResume: protectedProcedure
    .input(CreateResumeParamsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const shortId = nanoid(SHORT_ID_LENGTH);
        const { name, slug, isPublic } = input;
        const user = ctx.session?.user;
        const userId = user?.userId;
        const username = user?.name;
        // Create Resume and get its id
        const generatedResume = await ctx.prisma.resume.create({
          data: {
            shortId,
            name,
            slug,
            image: "/images/templates/resumes/leafish.jpg",
            basics: JSON.stringify({
              ...defaultResumeState.basics,
              name: username,
            }),
            sections: JSON.stringify({
              ...defaultResumeState.sections
            }),
            public: isPublic,
            userId,
            recruiter: JSON.stringify({
              ...defaultResumeState.recruiter
            }),
            metadata: JSON.stringify({
              ...defaultResumeState.metadata
            }),
          },
        });
        return { success: true }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload avatar",
        });
      }
    }),

  getResumes: protectedProcedure
  .query(async ({ctx}) => {
    try {
      const userId = ctx.session?.user.userId;
      const resumes: ResumeSchemaType[] = await ctx.prisma.resume.findMany({
        where: {userId: userId},
        orderBy: {createdAt: 'asc'}
      });
      return resumes.length > 0? resumes : [];
    } catch (error) {
      console.log("error", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error, please contact support",
      });
    }
  }),
  
  updateResum: protectedProcedure
  .input(ResumeSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const {id, recruiter, sections, metadata} = input;
      await ctx.prisma.resume.update({
        where: { id: id },
        data: {
          recruiter: recruiter,
          sections: sections,
          metadata: metadata
        },
      });
      return { success: true }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload avatar",
      });
    }
  }),

  getResumeBySlug: protectedProcedure
  .input(z.object({
    slug: z.string(),
  }))
  .query(async ({input, ctx}) => {
    const {slug} = input;
    try {
      const resumeSchemaObj = await ctx.prisma.resume.findFirst({
        where: { slug: slug },
      });

      const resume: Resume = {
        id: resumeSchemaObj?.id ?? 0,
        shortId: resumeSchemaObj?.shortId ?? '',
        name: resumeSchemaObj?.name ?? '',
        slug: resumeSchemaObj?.slug ?? '',
        image: resumeSchemaObj?.image ?? '',
        basics: JSON.parse(resumeSchemaObj?.basics ?? "{}"),
        sections: JSON.parse(resumeSchemaObj?.sections ?? "{}"),
        metadata: JSON.parse(resumeSchemaObj?.metadata ?? "{}"),
        recruiter: JSON.parse(resumeSchemaObj?.recruiter ?? "{}"),
        public: resumeSchemaObj?.public || false,
        userid: resumeSchemaObj?.userId ?? "",
      }
      return resume;
    } catch (error) {
      throw error instanceof TRPCError
          ? error
          : new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error, please contact support",
          });
    }
  }),

  deleteResume: protectedProcedure
  .input(DeleteResumeParamsSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const {id} = input;
      await ctx.prisma.resume.delete({
        where: { id: id },
      });
      return { success: true }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload avatar",
      });
    }
  }),

  renameResumeTemplate: protectedProcedure
  .input(RenameResumeParamsSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const {id, name, slug} = input;
      await ctx.prisma.resume.update({
        where: { id: id },
        data: {
          name: name,
          slug: slug,
        }
      });
      return { success: true }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload avatar",
      });
    }
  }),

  




  parseResume: protectedProcedure
    .input(parseResumeSchema)
    .use(roleAuthorization(["admin", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      const { base64pdfs, teamMembers, titles } = input;

      const allPromises = [];

      for (let i = 0; i < base64pdfs.length; i++) {
        const base64pdf = base64pdfs[i];
        const title = titles[i];
        allPromises.push(handleSinglePdf(base64pdf, title, teamMembers, ctx));
      }

      const results = await Promise.all(allPromises);

      const success = results.every((result) => result.success);

      return { success };
    }),
  inviteTeamMembers: protectedProcedure
    .input(inviteTeamMembersSchema)
    .use(roleAuthorization(["admin", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const { resumeId, teamMembers } = input;

        // Check existing permissions
        const existingPermissions = await ctx.prisma.resumePermission.findMany({
          where: {
            resumeId: resumeId,
          },
        });

        const existingMemberIds = existingPermissions.map((p) => p.userId);

        // Filter out members who are already part of the resume
        const membersToInvite = teamMembers.filter(
          (member) => !existingMemberIds.includes(member.id)
        );

        // Create permissions
        for (const member of membersToInvite) {
          await createPermission(ctx, resumeId, member.id, member.permission);

          await sendInviteToParse({
            email: member.email,
            resumeID: resumeId,
          });
        }

        return { success: true };
      } catch (error) {
        console.log("error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error, please contact support",
        });
      }
    }),
  getAllUserResumes: protectedProcedure
    .use(roleAuthorization(["admin", "owner", "member"]))
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.session?.user.userId;

        const createdByUser = await ctx.prisma.resume.findMany({
          where: { uploadedById: userId },
          include: {
            uploadedBy: userSelect,
            permissions: { include: { user: userSelect } },
          },
        });

        const createdByUserWithTeam = createdByUser.map((resume) => ({
          ...resume,
          team: formatPermissions(resume.permissions, userId),
        }));

        const permissions = await ctx.prisma.resumePermission.findMany({
          where: { userId },
          include: {
            document: {
              include: {
                uploadedBy: userSelect,
                permissions: { include: { user: userSelect } },
              },
            },
          },
        });

        const permittedToSee = permissions.map((p) => ({
          ...p.document,
          team: formatPermissions(p.document.permissions, userId),
        }));

        const response = [...createdByUserWithTeam, ...permittedToSee]
          .filter(
            (p, index, self) => index === self.findIndex((t) => t.id === p.id)
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        return { response: response.length > 0 ? response : [] };
      } catch (error) {
        console.log("error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error, please contact support",
        });
      }
    }),
  getSingleResume: protectedProcedure
    .input(z.object({ resumeId: z.string() }))
    .use(roleAuthorization(["admin", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const resumeId = input.resumeId;
        const userId = ctx.session.user.userId;

        const resume = await ctx.prisma.resume.findFirst({
          where: {
            resumeId: resumeId,
          },
          include: {
            uploadedBy: {
              select: { id: true, firstName: true, email: true, avatar: true },
            },
            permissions: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        if (!resume) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resume not found",
          });
        }

        const { permissions, ...rest } = resume;
        const singleResume = {
          ...rest,
          team: permissions.map((p) => ({
            ...p.user,
            permission: p.permission,
          })),
        };

        return { resumeDetails: singleResume };
      } catch (error) {
        console.log("error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error, please contact support",
        });
      }
    }),
  getResumeJsonFromGcloud: protectedProcedure
    .input(z.object({ resumeId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const { resumeId } = input;

        const resume = await ctx.prisma.resume.findUnique({
          where: { resumeId },
          select: { content: true },
        });

        if (!resume || !resume.content) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resume not found or content missing",
          });
        }

        const bucketName = "resume-parser-v1-1";
        const sanitizedFileName = resume.content.replace(`${bucketName}/`, "");

        // Your existing logic to read JSON from GCS
        const readJSONFromGCS = async (
          bucketName: string,
          fileName: string
        ) => {
          const storage = new Storage();
          const bucket = storage.bucket(bucketName);
          const file = bucket.file(fileName);

          return new Promise((resolve, reject) => {
            let data = "";

            const readStream: Readable = file.createReadStream();

            readStream.on("data", (chunk) => {
              data += chunk;
            });

            readStream.on("end", () => {
              // console.log(`Data received from GCS: ${data}`);
              // Simply resolve the raw string data
              resolve(data);
            });

            readStream.on("error", (err) => {
              console.error("Error reading file:", err);
              reject(err);
            });
          });
        };

        const json = await readJSONFromGCS(bucketName, sanitizedFileName);
        return { json };
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
  updateTeamResumeAccess: protectedProcedure
    .input(updateTeamAccessInputSchema)
    .use(roleAuthorization(["admin", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const { resumeId, teamMembers } = input;
        const userIds = teamMembers.map((update) => update.userId);

        // Fetch the actual Resume ID corresponding to the provided resumeId
        const resume = await ctx.prisma.resume.findUnique({
          where: { resumeId: resumeId },
        });
        if (!resume) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resume not found",
          });
        }
        const actualResumeId = resume.id;

        // Fetch existing permissions
        const currentTeamMembers = await ctx.prisma.resumePermission.findMany({
          where: { resumeId: actualResumeId },
          select: {
            id: true,
            userId: true,
            // Add other fields you need
          },
        });

        // Identify members to remove
        const membersToRemove = currentTeamMembers.filter(
          (member) => !userIds.includes(member.userId)
        );

        // Remove those members
        await Promise.all(
          membersToRemove.map((member) =>
            ctx.prisma.resumePermission.delete({ where: { id: member.id } })
          )
        );

        // Upsert permissions for the remaining team members
        await Promise.all(
          teamMembers.map((member) => {
            return ctx.prisma.resumePermission.upsert({
              where: {
                resumeId_userId: {
                  resumeId: actualResumeId, // Use actualResumeId here
                  userId: member.userId,
                },
              },
              update: { permission: member.permission },
              create: {
                resumeId: actualResumeId, // Use actualResumeId here
                userId: member.userId,
                permission: member.permission,
              },
            });
          })
        );

        return { success: true };
      } catch (error) {
        console.error(error);
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error, please contact support",
          });
      }
    }),
  deleteResumes: protectedProcedure
    .input(deleteResumesSchema)
    .use(roleAuthorization(["admin", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      try {
        const bucketName = "resume-parser-v1-1";

        for (const resumeId of input.resumeIds) {
          const pdfFileName = `pdf/${resumeId}.pdf`;
          const jsonFileName = `json/${resumeId}.json`;

          await deleteFileFromGCS(bucketName, pdfFileName);
          await deleteFileFromGCS(bucketName, jsonFileName);
        }

        await ctx.prisma.resume.deleteMany({
          where: { resumeId: { in: input.resumeIds } },
        });

        return { success: true };
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
  updateResumeTitleStatus: protectedProcedure
    .input(updateResumeStatusSchema)
    .use(roleAuthorization(["admin", "owner", "member"]))
    .mutation(async ({ input, ctx }) => {
      try {
        // Find the actual Resume ID for the given resumeId
        const resume = await ctx.prisma.resume.findUnique({
          where: { resumeId: input.resumeId },
        });
        if (!resume) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resume not found",
          });
        }
        const actualResumeId = resume.id;

        // Update s ptatus or title for the resume
        await ctx.prisma.resume.update({
          where: { id: actualResumeId },
          data: {
            status: input.status || resume.status, // Update if provided
            title: input.title || resume.title, // Update if provided
            lastUpdatedBy: ctx.session.user.userId,
          },
        });

        return { success: true };
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
