import { z } from 'zod';

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/);
const passwordSchema = z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/);
const tokenSchema = z.string().min(32).max(512);

export const staffActivateSchema = z.object({
  inviteToken: tokenSchema,
  password: passwordSchema,
});

export const staffSignInSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export const staffMfaVerifySchema = z.object({
  challengeToken: tokenSchema,
  code: z
    .string()
    .trim()
    .regex(/^(?:\d{6}|[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3})$/i),
});

export const staffLogoutSchema = z.object({}).strict();

export type StaffActivateInput = z.infer<typeof staffActivateSchema>;
export type StaffSignInInput = z.infer<typeof staffSignInSchema>;
export type StaffMfaVerifyInput = z.infer<typeof staffMfaVerifySchema>;
