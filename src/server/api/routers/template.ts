import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { CreateResumeParamsSchema, ResumeSchema, ResumeSchemaType, Resume, DeleteResumeParamsSchema, RenameResumeParamsSchema } from "~/schema";
import { nanoid } from "nanoid";
import { SHORT_ID_LENGTH, TemplateType, defaultCoverState, defaultResumeState } from "~/constants";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import templateMap from "~/templates/templateMap";

export const templateRouter = createTRPCRouter({
  createResume: protectedProcedure
    .input(CreateResumeParamsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const shortId = nanoid(SHORT_ID_LENGTH);
        const { name, slug, isPublic, type, template_id } = input;
        const user = ctx.session?.user;
        const userId = user?.userId ?? '';
        const username = user?.name;
        // Create Resume and get its id
        let resume = null;

        if (type == TemplateType.RESUME_TEMPLATE) {
          resume = await ctx.prisma.template.create({
            data: {
              shortId,
              name,
              slug,
              image: defaultResumeState.image,
              basics: JSON.stringify({
                ...defaultResumeState.basics,
                name: username,
              }),
              sections: JSON.stringify({
                ...defaultResumeState.sections
              }),
              public: isPublic,
              userId,
              metadata: JSON.stringify({
                ...defaultResumeState.metadata,
                template_id,
              }),
              covermetadata: JSON.stringify({
                ...defaultResumeState.covermetadata
              }),
              type,
            },
          });
        }
        else {
          resume = await ctx.prisma.template.create({
            data: {
              shortId,
              name,
              slug,
              image: defaultCoverState.image,
              basics: JSON.stringify({
                ...defaultCoverState.basics,
                name: username,
              }),
              sections: JSON.stringify({
                ...defaultCoverState.sections
              }),
              public: isPublic,
              userId: userId,
              metadata: JSON.stringify({
                ...defaultCoverState.metadata,
                template_id
              }),
              covermetadata: JSON.stringify({
                ...defaultCoverState.covermetadata
              }),
              type
            },
          });
        }
        return { success: true }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create resume",
        });
      }
    }),

  getResumes: protectedProcedure
    .input(z.object({
      type: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const { type } = input;
        const userId = ctx.session?.user.userId;
        const resumes: ResumeSchemaType[] = await ctx.prisma.template.findMany({
          where: { userId: userId, type },
          orderBy: { createdAt: 'asc' }
        });
        return resumes.length > 0 ? resumes : [];
      } catch (error) {
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
        const { id, sections, metadata, basics } = input;
        await ctx.prisma.template.update({
          where: { id: id },
          data: {
            basics: basics,
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
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      try {
        const resumeSchemaObj = await ctx.prisma.template.findFirst({
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
          covermetadata: JSON.parse(resumeSchemaObj?.covermetadata ?? "{}"),
          public: resumeSchemaObj?.public || false,
          userid: resumeSchemaObj?.userId ?? "",
          type: resumeSchemaObj?.type ?? "",
          checked: false,
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
        const { id } = input;
        await ctx.prisma.template.delete({
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
        const { id, name, slug } = input;
        await ctx.prisma.template.update({
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

  getTemplates: protectedProcedure
    .query(async ({ ctx }) => {
      const user = ctx.session?.user;
      const userId = user?.userId ?? '';
      
      try { 
        const records = await ctx.prisma.template.findMany({
          where: { userId: userId },
        });

        let templates: Resume[] = [];
        Object.values(templateMap).map((item) => {
          let temp: Resume = JSON.parse(JSON.stringify(defaultResumeState));
          temp.metadata.template = item.id;
          if(item.type === TemplateType.COVER_TEMPLATE) temp.metadata.layout = { ...defaultCoverState.metadata.layout }
          temp.type = item.type;
          temp.name = item.name;
          temp.image = item.preview;
          templates?.push(temp);
        });

        const tpls: Resume[] = records.map((record) => {
          const resume: Resume = {
            id: record?.id ?? 0,
            shortId: record?.shortId ?? '',
            name: record?.name ?? '',
            slug: record?.slug ?? '',
            image: record?.image ?? '',
            basics: JSON.parse(record?.basics ?? "{}"),
            sections: JSON.parse(record?.sections ?? "{}"),
            metadata: JSON.parse(record?.metadata ?? "{}"),
            covermetadata: JSON.parse(record?.covermetadata ?? "{}"),
            public: record?.public || false,
            userid: record?.userId ?? "",
            type: record?.type ?? "",
            checked: false,
          }
          return resume;
        });

        return templates.concat(tpls);
      } catch (error) {
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error, please contact support",
          });
      }
    }),

  createIntegratedResume: protectedProcedure
    .input(z.object({ resume: z.string(), name: z.string(), slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { resume, name, slug } = input;
      const resumeobj: Resume = JSON.parse(resume);
      const user = ctx.session?.user;
      const userId = user?.userId ?? '';
      const shortId = nanoid(SHORT_ID_LENGTH);

      const result = await ctx.prisma.template.create({
        data: {
          shortId,
          name,
          slug,
          image: resumeobj.image,
          basics: JSON.stringify({
            ...resumeobj.basics
          }),
          sections: JSON.stringify({
            ...resumeobj.sections
          }),
          public: true,
          userId: userId,
          metadata: JSON.stringify({
            ...resumeobj.metadata
          }),
          covermetadata: JSON.stringify({
            ...resumeobj.covermetadata
          }),
          type: TemplateType.RESUME
        },
      });
      const resume_id = result.id;
      return { resume_id }
    }),


  getResumeById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      try {
        const resumeSchemaObj = await ctx.prisma.template.findFirst({
          where: { id: id },
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
          covermetadata: JSON.parse(resumeSchemaObj?.covermetadata ?? "{}"),
          public: resumeSchemaObj?.public || false,
          userid: resumeSchemaObj?.userId ?? "",
          type: resumeSchemaObj?.type ?? "",
          checked: false,
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
});