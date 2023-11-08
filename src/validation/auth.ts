import { object, string, boolean, type TypeOf, type z } from "zod";
import { isGenericEmail } from "~/components/authentication/isGenericEmail";

export const loginUserSchema = object({
  email: string().email(),
  password: string().min(8).optional(),
  loginToken: string().optional(),
});

export const registerUserSchema = object({
  email: string(),
  password: string(),
  confirmPassword: string(),
  tempOrgName: string(),
  firstName: string(),
});

export const forgotPasswordSchema = object({
  email: string().email(),
});

export const verifyEmailSchema = object({
  token: string(),
  email: string(),
});

export const userResetPasswordSchema = object({
  newPassword: string().min(8),
  token: string(),
  isInvite: boolean().optional(),
});

export type Login = TypeOf<typeof loginUserSchema>;
export type Register = TypeOf<typeof registerUserSchema>;
export type ForgotPwUserInput = TypeOf<typeof forgotPasswordSchema>;
export type VerifyEmail = TypeOf<typeof verifyEmailSchema>;
export type UserResetPassword = TypeOf<typeof userResetPasswordSchema>;

export interface SignupOutput {
  status: number;
  message: string;
  result: string;
}

export interface ForgotPwOutput {
  status: number;
  message: string;
}

export interface VerifyEmailOutput {
  status: number;
  message: string;
  loginToken: string;
}

export interface UserSetNewPasswordOutput {
  status: number;
  message: string;
}

export interface ResendVerificationEmailOutput {
  status: number;
  message: string;
}
