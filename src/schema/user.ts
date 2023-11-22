import { Resume } from "./resume";

export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    password?: string;
    resumes: Resume[];
    createdAt: Date;
    updatedAt: Date;
}


export interface SessionData {
    user: {
      userId: string;
    };
    message: string;
    success: boolean;
  }