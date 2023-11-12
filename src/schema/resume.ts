import { TypeOf, boolean, date, number, object, string } from 'zod';
import { Basics } from './basics';
import { Metadata } from './metadata';
import { Recruiter } from './recruiter';
import { Section } from './section';
import { User } from './user';

export type Resume = {
  id: number;
  type: string;
  shortId: string;
  name: string;
  slug: string;
  image: string;
  user?: User;
  basics: Basics;
  sections: Record<string, Section>;
  metadata: Metadata;
  public: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userid: string,
}

export const CreateResumeParamsSchema = object(
  {
    name: string(),
    slug: string(),
    isPublic: boolean(),
    type: string(),
  }
)

export const ResumeSchema = object(
  {
    id: number(),
    shortId: string(),
    name: string(),
    slug: string(),
    image: string(),
    basics: string().nullable(),
    sections: string().nullable(),
    metadata: string().nullable(),
    public: boolean(),
    userId: string(),
  }
);

export const DeleteResumeParamsSchema = object({
  id: number(),
})

export const RenameResumeParamsSchema = object({
  id: number(),
  name: string(),
  slug: string(),
});


export type ResumeSchemaType = TypeOf<typeof ResumeSchema>