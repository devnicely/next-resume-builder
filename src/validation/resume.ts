import { array, boolean, date, nativeEnum, number, object, string, type TypeOf, type z } from "zod";

enum PermissionType {
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
  LEAD = "LEAD",
}

enum ResumeStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  INPROGRESS = "INPROGRESS",
  CANCELED = "CANCELED",
  DONE = "DONE",
}

export const parseResumeSchema = object({
  titles: array(string()),
  teamMembers: array(
    object({
      id: string(),
      permission: nativeEnum(PermissionType),
      email: string().email(),
    })
  ).optional(),
  base64pdfs: array(string()),
});

export const removeTeamMembersSchema = object({
  resumeId: string(),
  userIds: array(string()),
});

export const updateResumeSchema = object({
  resumeId: string(),
  title: string(),
  addMembers: array(
    object({
      id: string(),
      permission: nativeEnum(PermissionType),
    })
  ),
  removeMembers: array(string()),
});

export const updateResumeStatusSchema = object({
  resumeId: string(),
  title: string(),
  status: nativeEnum(ResumeStatus).optional(),
});

export const deleteResumesSchema = object({
  resumeIds: array(string()),
});

export const inviteTeamMembersSchema = object({
  teamMembers: array(
    object({
      id: string(),
      permission: nativeEnum(PermissionType),
      email: string().email(),
    })
  ).optional(),
});

export const updateTeamAccessInputSchema = object({
  resumeId: string(),
  teamMembers: array(
    object({
      userId: string(),
      permission: nativeEnum(PermissionType),
    })
  ),
});


export type RemoveTeamMember = TypeOf<typeof removeTeamMembersSchema>;
export type UpdateResume = TypeOf<typeof updateResumeSchema>;
export type UpdateResumeStatus = TypeOf<typeof updateResumeStatusSchema>;
export type DeleteResumes = TypeOf<typeof deleteResumesSchema>;
export type ParseResume = TypeOf<typeof parseResumeSchema>;
export type InviteTeamMembers = TypeOf<typeof inviteTeamMembersSchema>;
export type UpdateTeamAccessInput = TypeOf<typeof updateTeamAccessInputSchema>;
