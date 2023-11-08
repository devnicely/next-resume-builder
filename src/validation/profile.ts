import { any, object, string, type TypeOf, type z } from "zod";

export const userProfileSchema = object({
  id: string().optional(),
  firstName: string().optional(),
  lastName: string().optional(),
  email: string().optional(),
  country: string().optional(),
  avatar: object({
    url: string(),
    public_id: string(),
  }).optional(),
});

export const updateUserDetailsSchema = object({
  firstName: string().optional(),
  lastName: string().optional(),
  country: string().optional(),
  avatar: any().optional(),
});

export const updateUserSecuritySchema = object({
  newPassword: string().optional(),
  confirmPassword: string().optional(),
  email: string().optional(),
}).refine(
  (data) => {
    return data.newPassword === data.confirmPassword;
  },
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

export type UserProfile = TypeOf<typeof userProfileSchema>;
export type UpdateUserDetails = TypeOf<typeof updateUserDetailsSchema>;
export type UpdateUserSecurity = TypeOf<typeof updateUserSecuritySchema>;
