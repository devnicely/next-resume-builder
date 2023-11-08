import { object, string, type TypeOf, type z } from "zod";

export const inviteTeamMemberSchema = object({
  orgId: string(),
  emails: string({
    required_error: "Email is invalid",
  })
    .email()
    .array(),
});

export const acceptInviteSchema = object({
  orgId: string(),
  email: string(),
  token: string(),
});

export type InviteTeamMember = TypeOf<typeof inviteTeamMemberSchema>;
export type AcceptInvite = TypeOf<typeof acceptInviteSchema>;
