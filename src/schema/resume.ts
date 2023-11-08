import { TypeOf, boolean, date, number, object, string } from 'zod';
import { Basics } from './basics';
import { Metadata } from './metadata';
import { Recruiter } from './recruiter';
import { Section } from './section';
import { User } from './user';

export type Resume = {
  id: number;
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
  recruiter: Recruiter;
  userid: string,
}

export const CreateResumeParamsSchema = object(
  {
    name: string(),
    slug: string(),
    isPublic: boolean()
  }
)

export const ResumeSchema = object(
  {
    id: number(),
    shortId: string(),
    name: string(),
    slug: string(),
    image: string(),
    recruiter: string().nullable(),
    basics: string().nullable(),
    sections: string().nullable(),
    metadata: string().nullable(),
    public: boolean(),
    userId: string(),
  }
);

export type ResumeSchemaType = TypeOf<typeof ResumeSchema>