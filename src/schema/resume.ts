import { TypeOf, boolean, date, number, object, string } from 'zod';
import { Basics } from './basics';
import { Metadata } from './metadata';
import { Recruiter } from './recruiter';
import { Section } from './section';
import { User } from './user';

export type Resume = {
  id: string;
  type: string;
  shortId: string;
  name: string;
  slug: string;
  image: string;
  user?: User;
  basics: Basics;
  sections: Record<string, Section>;
  metadata: Metadata;
  covermetadata: Metadata;
  public: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userid: string;
  checked: boolean;
  resumeId?: string;
}

export const CreateResumeParamsSchema = object(
  {
    name: string(),
    slug: string(),
    isPublic: boolean(),
    type: string(),
    template_id: string(),
  }
)

export const ResumeSchema = object(
  {
    id: string(),
    shortId: string(),
    name: string(),
    slug: string(),
    image: string(),
    basics: string().nullable(),
    sections: string().nullable(),
    metadata: string().nullable(),
    public: boolean(),
    userId: string(),
    resumeId: string().nullable().optional(),
  }
);

export const DeleteResumeParamsSchema = object({
  id: string(),
})

export const RenameResumeParamsSchema = object({
  id: string(),
  name: string(),
  slug: string(),
});


export type ResumeSchemaType = TypeOf<typeof ResumeSchema>